import { Component, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { CartItem } from './modals/cart.model';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment';

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
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('Marketplace-project');
  cartItems: CartItem[] = [];
  cartItemCount = 0;
  cartTotal = 0;
  private destroy$ = new Subject<void>();
  
  constructor(
    public authService: AuthService,//inject for services
    private cartService: CartService,
    private router: Router //form page to page 
  ) {}

  ngOnInit(): void {

  this.authService.loadUser()
    .pipe(takeUntil(this.destroy$))
    .subscribe(user => {
      if (!user) return;

      this.authService.CustomerProfile()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            if (res?.reloginRequired) {
              const returnUrl = '/spa/callback?to=/';

              window.location.href =
                `${environment.apiUrl}/login?returnUrl=${encodeURIComponent(returnUrl)}`;
            }
          },
          error: (err: HttpErrorResponse) => {
            if (err.status === 401) return;
            console.error('Provision failed', err);
          }
        });
    });

  this.cartService.cart$
    .pipe(takeUntil(this.destroy$))
    .subscribe((cart) => {
      this.cartItems = cart.items;
      this.cartItemCount = cart.totalItems;
      this.cartTotal = cart.totalPrice;
    });
}


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login(): void {//call login fun in service
    this.authService.login();
  }

logout(): void {
  this.authService.logout(); 
}
  get isAuthenticated(): boolean {
    return this.authService.isAuthenticatedSig();
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
    }
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }
}