import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  private readonly _isAuthenticated = signal<boolean>(false);
  isAuthenticatedSig = this._isAuthenticated;

  userSig = signal<any | null>(null);
  sessionIdSig = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  /**
   * Extract session ID from idsrv.session cookie
   */
  private getSessionId(): string | null {
    const cookies = document.cookie.split(';');
    const sessionCookie = cookies.find(cookie => 
      cookie.trim().startsWith('idsrv.session=')
    );
    
    if (sessionCookie) {
      const sessionId = sessionCookie.split('=')[1].trim();
      return sessionId;
    }
    
    return null;
  }

  loadUser() {
    // Get session ID from cookie
    const sessionId = this.getSessionId();
    
    if (sessionId) {
      this._isAuthenticated.set(true);
      this.sessionIdSig.set(sessionId);
    } else {
      this._isAuthenticated.set(false);
      this.sessionIdSig.set(null);
    }

    // Still try to load user from BFF for additional user data (optional)
    return this.http.get<any>(`${this.apiUrl}/bff/user`, { withCredentials: true }).pipe(
      tap((user) => {
        console.log('User data from BFF:', user);
        if (Array.isArray(user) && user.length > 0) {
          this.userSig.set(user);
        }
      }),
      catchError((error) => {
        console.log('BFF user endpoint not available (using cookie auth only)');
        return of(undefined);
      }),
    );
  }
  login(): void {
    const spaPath = window.location.pathname + window.location.search;

    const bffReturnUrl = `/spa/callback?to=${encodeURIComponent(spaPath)}`;

    window.location.href = `${this.apiUrl}/bff/login?returnUrl=${encodeURIComponent(bffReturnUrl)}`;
  }

  /** Logout */
  logout() {
    console.log('Logging out...');
    
    // Remove the idsrv.session cookie
    document.cookie = 'idsrv.session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=None; Secure';
    
    // Also try to remove it for the BFF domain
    document.cookie = 'idsrv.session=; path=/; domain=localhost; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=None; Secure';
    
    // Clear auth state
    this.userSig.set(null);
    this._isAuthenticated.set(false);
    this.sessionIdSig.set(null);
    
    console.log('Cookie removed, auth state cleared');
    console.log('Remaining cookies:', document.cookie);
    
    // Navigate to products
    this.router.navigate(['/products']);
    
    // Return observable for consistency
    return of(null);
  }
}
