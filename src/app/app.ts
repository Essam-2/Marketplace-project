import { Component, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';

interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  protected readonly title = signal('Marketplace-project');
  
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.loadUser().subscribe();
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout().subscribe();
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticatedSig();
  }
  cartItems: CartItem[] = [
    // Example items to test empty state
    { id: '1', name: 'Product 1', price: '$99.99', quantity: 2 },
    { id: '2', name: 'Product 2', price: '$49.99', quantity: 1 },
  ];

  get cartItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  get cartTotal(): string {
    const total = this.cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return sum + (price * item.quantity);
    }, 0);
    return `$${total.toFixed(2)}`;
  }

  removeFromCart(itemId: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
  }

  clearCart(): void {
    this.cartItems = [];
  }
}