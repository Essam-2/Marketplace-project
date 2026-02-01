import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../modals/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatBadgeModule],
  templateUrl: './products.html',
  styleUrls: ['./products.scss'],
})
export class ProductsComponent implements OnInit {
  data: Product[] = [];
  cartItemCount = 0;
  
  // Array of available images in assets folder
  private productImages: string[] = [
    '/assets/image1.jpg',
    '/assets/image2.jpg',
    '/assets/image3.jpg',
    '/assets/image4.jpg'
  ];

  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    
    // Subscribe to cart changes
    this.cartService.cart$.subscribe((cart) => {
      this.cartItemCount = cart.totalItems;
      this.cdr.detectChanges();
    });
  }

  loadProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (products) => {
        // Assign random images to products that don't have images
        this.data = products.map(product => {
          if (!product.image) {
            const randomImage = this.productImages[Math.floor(Math.random() * this.productImages.length)];
            return { ...product, image: randomImage };
          }
          return product;
        });
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.data = [];
        this.cdr.detectChanges();
      }
    });
  }



  /**
   * Add product to cart
   */
  addToCart(product: Product): void {
    // Check if product is in stock
    if (!product.availableQuantity || product.availableQuantity <= 0) {
      this.snackBar.open('This product is out of stock', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      return;
    }

    const success = this.cartService.addToCart(product, 1);
    
    if (success) {
      this.snackBar.open(`${product.name} added to cart!`, 'View Cart', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      }).onAction().subscribe(() => {
        this.router.navigate(['/cart']);
      });
    } else {
      this.snackBar.open('Cannot add more items than available quantity', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    }
  }

  /**
   * Navigate to cart
   */
  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  /**
   * Navigate to product details
   */
  viewProductDetails(product: Product): void {
    this.router.navigate(['/products', product.productId]);
  }
}