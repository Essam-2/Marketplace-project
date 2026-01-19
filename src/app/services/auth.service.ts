import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSignal = signal<boolean>(false);
  
  constructor(private router: Router) {
    // Check if user was previously logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isAuthenticatedSignal.set(isLoggedIn);
  }

  get isAuthenticated() {
    return this.isAuthenticatedSignal();
  }

  login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        // For demo purposes, accept any email/password
        // Replace with actual authentication logic
        this.isAuthenticatedSignal.set(true);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        resolve(true);
      }, 1000);
    });
  }

  logout(): void {
    this.isAuthenticatedSignal.set(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }

  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }
}
