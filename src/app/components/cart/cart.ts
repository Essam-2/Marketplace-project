import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { Cart, CartItem } from '../../modals/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart | null = null;
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private ordersService: OrdersService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cart) => {
        this.cart = cart;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Update item quantity
   */
  updateQuantity(productId: string, newQuantity: number): void {
    if (newQuantity < 1) {
      return;
    }
    const success = this.cartService.updateQuantity(productId, newQuantity);
    
    if (!success) {
      this.snackBar.open('Cannot exceed available quantity', 'Close', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    }
  }

  /**
   * Increment quantity
   */
  incrementQuantity(item: CartItem): void {
    const availableQuantity = item.product.availableQuantity || 0;
    if (item.quantity >= availableQuantity) {
      this.snackBar.open('Cannot add more than available quantity', 'Close', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      return;
    }
    this.updateQuantity(item.product.productId, item.quantity + 1);
  }

  /**
   * Decrement quantity
   */
  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.updateQuantity(item.product.productId, item.quantity - 1);
    }
  }

  /**
   * Remove item from cart
   */
  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
    this.snackBar.open('Item removed from cart', 'Close', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  /**
   * Clear entire cart
   */
  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
      this.snackBar.open('Cart cleared', 'Close', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    }
  }

  /**
   * Create order from cart items
   */
  placeOrder(): void {
    if (!this.cart || this.cart.items.length === 0) {
      this.snackBar.open('Your cart is empty', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.isLoading = true;

    // Create order payload matching the API structure
    const orderData = {
      items: this.cart.items.map(item => ({
        productId: item.product.productId,
        productName: item.product.name,
        qty: item.quantity,
        price: item.product.price,
      })),
    };

    this.ordersService.addOrder(orderData as any).subscribe({
      next: (order) => {
        this.isLoading = false;
        this.cartService.clearCart();
        this.snackBar.open('Order placed successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to place order. Please try again.', 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  /**
   * Continue shopping
   */
  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  /**
   * Get item subtotal
   */
  getItemSubtotal(item: CartItem): number {
    return Math.round(item.product.price * item.quantity * 100) / 100;
  }
}
