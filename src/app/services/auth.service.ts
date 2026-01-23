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

    // Still try to load user from BFF for additional user data 
    return this.http.get<any>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      tap((user) => {
        if (Array.isArray(user) && user.length > 0) {
          this.userSig.set(user);
        }
      }),
      catchError((error) => {
        return of(undefined);
      }),
    );
  }
  login(): void {
    const spaPath = window.location.pathname + window.location.search;

    const bffReturnUrl = `/spa/callback?to=${encodeURIComponent(spaPath)}`;

    window.location.href = `${this.apiUrl}/login?returnUrl=${encodeURIComponent(bffReturnUrl)}`;
  }

  /** Logout */
  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        // Clear auth state only on successful logout
        this.userSig.set(null);
        this._isAuthenticated.set(false);
        this.sessionIdSig.set(null);

        // Navigate to products
        this.router.navigate(['/products']);
      }),
      catchError((error) => {
        return of(null);
      })
    );
  }
}
