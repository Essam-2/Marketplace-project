import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, of, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  isAuthenticatedSig = signal(false);

  constructor(private http: HttpClient, private router: Router) {}

  loadUser() {
    return this.http.get<any>(`${this.apiUrl}/user`, { withCredentials: true }).pipe(
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

  private getCsrf() {
  return this.http.get('https://localhost:7251/bff/csrf', {
    responseType: 'text',
    withCredentials: true
  });
}

logout() {
  return this.getCsrf().pipe(
    switchMap(token => {
      const headers = new HttpHeaders({ 'X-CSRF': token });
      return this.http.post('https://localhost:7251/bff/logout', null, {
        headers,
        withCredentials: true,
        responseType: 'text'
      });
    }),
    tap(() => {
      this.isAuthenticatedSig.set(false);
      this.router.navigate(['/products']);
    })
  );
}
}
