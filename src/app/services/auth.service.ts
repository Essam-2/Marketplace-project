import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  isAuthenticatedSig = signal(false);

  constructor(private http: HttpClient, private router: Router) {}

  loadUser() {
    return this.http.get<any>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      tap(user => {
        this.isAuthenticatedSig.set(!!user);
      }),
      catchError(() => {
        this.isAuthenticatedSig.set(false);
        return of(null);
      })
    );
  }

  login() {
    const spaPath = window.location.pathname + window.location.search;
    const bffReturnUrl = `/spa/callback?to=${encodeURIComponent(spaPath)}`;

    // NOTE: Duende BFF endpoints are normally /bff/login not /login
    // If your apiUrl already ends with /bff, then use `${this.apiUrl}/login`
    // Otherwise use `${this.apiUrl}/bff/login`
    window.location.href = `${this.apiUrl}/login?returnUrl=${encodeURIComponent(bffReturnUrl)}`;
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.isAuthenticatedSig.set(false);
        this.router.navigate(['/products']);
      })
    );
  }
}
