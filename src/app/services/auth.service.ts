import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl; 

  isAuthenticatedSig = signal(false);

  constructor(private http: HttpClient, private router: Router) {}

  loadUser() {
    return this.http.get<any>(`${this.apiUrl}/user`, { withCredentials: true }).pipe(
      tap(user => this.isAuthenticatedSig.set(!!user)),
      catchError(() => {
        this.isAuthenticatedSig.set(false);
        return of(null);
      })
    );
  }

CustomerProfile() {
  return this.http.post(`${environment.apiUrl}/customer-profile`, {}, {
    withCredentials: true
  });
}

  login() {
    const spaPath = window.location.pathname + window.location.search;
    const bffReturnUrl = `/spa/callback?to=${encodeURIComponent(spaPath)}`;

    window.location.href = `${this.apiUrl}/login?returnUrl=${encodeURIComponent(bffReturnUrl)}`;
  }

logout(): void {
  this.http.get<any[]>(`${this.apiUrl}/user`, { withCredentials: true })
    .subscribe({
      next: claims => {
        const logoutUrl = claims.find(c => c.type === 'bff:logout_url')?.value;
        const returnUrl = '/spa/callback?to=/';

        if (!logoutUrl) {
          window.location.href =
            `${this.apiUrl}/logout?returnUrl=${encodeURIComponent(returnUrl)}`;
          return;
        }

        const url = new URL(logoutUrl, this.apiUrl);
        url.searchParams.set('returnUrl', returnUrl);

        window.location.href = url.toString();
      },
      error: () => {
        const returnUrl = '/spa/callback?to=/';
        window.location.href =
          `${this.apiUrl}/logout?returnUrl=${encodeURIComponent(returnUrl)}`;
      }
    });
}

}




