import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { Cart } from '../../modals/cart.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss'],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cart: Cart | null = null;
  checkoutForm: FormGroup;
  isLoading = false;
  showNewAddressField = false;
  private destroy$ = new Subject<void>();

  // Saved addresses
  savedAddresses = [
    { id: '1', label: 'Home', address: '15 El Tahrir Street, Dokki, Giza, Egypt' },
    { id: '2', label: 'Work', address: '25 Mohamed Farid Street, Downtown, Cairo, Egypt' },
    { id: '3', label: 'Parents House', address: '40 El Nasr Road, Nasr City, Cairo, Egypt' },
  ];

  paymentMethods = [
    { value: 'credit-card', label: 'Credit Card', icon: 'credit_card' },
    { value: 'debit-card', label: 'Debit Card', icon: 'credit_card' },
    { value: 'cash', label: 'Cash on Delivery', icon: 'payments' },
  ];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private ordersService: OrdersService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      addressSelection: ['', Validators.required],
      newAddress: [''],
      address: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      paymentMethod: ['credit-card', Validators.required],
      cardNumber: [''],
      cardHolder: [''],
      expiryDate: [''],
      cvv: [''],
    });
  }

  ngOnInit(): void {
    // Get cart data
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cart) => {
        this.cart = cart;
        if (!cart || cart.items.length === 0) {
          this.snackBar.open('Your cart is empty', 'Close', { duration: 3000 });
          this.router.navigate(['/cart']);
        }
      });

    // Handle address selection changes
    this.checkoutForm.get('addressSelection')?.valueChanges.subscribe((value) => {
      if (value === 'new') {
        this.showNewAddressField = true;
        this.checkoutForm.get('newAddress')?.setValidators([Validators.required, Validators.minLength(10)]);
        this.checkoutForm.get('address')?.clearValidators();
        this.checkoutForm.patchValue({ address: '' });
      } else {
        this.showNewAddressField = false;
        this.checkoutForm.get('newAddress')?.clearValidators();
        this.checkoutForm.get('address')?.setValidators(Validators.required);
        // Find and set the selected address
        const selectedAddress = this.savedAddresses.find(addr => addr.id === value);
        if (selectedAddress) {
          this.checkoutForm.patchValue({ address: selectedAddress.address });
        }
      }
      this.checkoutForm.get('newAddress')?.updateValueAndValidity();
      this.checkoutForm.get('address')?.updateValueAndValidity();
    });

    // Add validators to card fields based on payment method
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe((method) => {
      const cardNumber = this.checkoutForm.get('cardNumber');
      const cardHolder = this.checkoutForm.get('cardHolder');
      const expiryDate = this.checkoutForm.get('expiryDate');
      const cvv = this.checkoutForm.get('cvv');

      if (method === 'credit-card' || method === 'debit-card') {
        cardNumber?.setValidators([Validators.required, Validators.pattern(/^[0-9]{16}$/)]);
        cardHolder?.setValidators([Validators.required, Validators.minLength(3)]);
        expiryDate?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)]);
        cvv?.setValidators([Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]);
      } else {
        cardNumber?.clearValidators();
        cardHolder?.clearValidators();
        expiryDate?.clearValidators();
        cvv?.clearValidators();
      }

      cardNumber?.updateValueAndValidity();
      cardHolder?.updateValueAndValidity();
      expiryDate?.updateValueAndValidity();
      cvv?.updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  placeOrder(): void {
    if (this.checkoutForm.invalid) {
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    if (!this.cart || this.cart.items.length === 0) {
      this.snackBar.open('Your cart is empty', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.isLoading = true;

    // Create order payload (payment details are not sent to backend)
    const finalAddress = this.showNewAddressField 
      ? this.checkoutForm.value.newAddress 
      : this.checkoutForm.value.address;

    const orderData = {
      totalItems: this.cart.items.reduce((sum, item) => sum + item.quantity, 0),
      totalOrderPrice: this.cart.totalPrice,
      items: this.cart.items.map(item => ({
        productId: item.product.productId,
        quantity: item.quantity,
        unitPrice: item.product.price,
        name: item.product.name,
      })),
      // These could be sent to backend in a real application
      deliveryAddress: finalAddress,
      contactNumber: this.checkoutForm.value.mobile,
    };

    this.ordersService.addOrder(orderData as any).subscribe({
      next: (order) => {
        this.isLoading = false;
        this.cartService.clearCart();
        this.snackBar.open('Order placed successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to place order. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }

  get selectedPaymentMethod(): string {
    return this.checkoutForm.get('paymentMethod')?.value || 'credit-card';
  }

  get isCardPayment(): boolean {
    const method = this.selectedPaymentMethod;
    return method === 'credit-card' || method === 'debit-card';
  }
}
