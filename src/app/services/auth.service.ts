import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly bffBaseUrl = 'https://localhost:7251';

  private readonly _isAuthenticated = signal<boolean>(false);
  isAuthenticatedSig = this._isAuthenticated;

  userSig = signal<any | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

 
  loadUser() {
    return this.http
      .get<any>(`${this.bffBaseUrl}/bff/user`, { withCredentials: true })
      .pipe(
        tap(user => {
          this.userSig.set(user);
          this._isAuthenticated.set(true);
        }),
        catchError(() => {
          this.userSig.set(null);
          this._isAuthenticated.set(false);
          return of(null);
        })
      );
  }
login(): void {
  const spaPath = window.location.pathname + window.location.search;

  const bffReturnUrl = `/spa/callback?to=${encodeURIComponent(spaPath)}`;

  window.location.href =
    `${this.bffBaseUrl}/bff/login?returnUrl=${encodeURIComponent(bffReturnUrl)}`;
}




  /** Logout */
  logout() {
    const headers = new HttpHeaders({ 'X-CSRF': '1' });

    return this.http
      .post(`${this.bffBaseUrl}/bff/logout`, {}, { withCredentials: true, headers })
      .pipe(
        tap(() => {
          this.userSig.set(null);
          this._isAuthenticated.set(false);
          this.router.navigate(['/']);
        })
      );
  }
}
