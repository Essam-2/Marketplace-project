import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class BffCsrfInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Adjust the condition to match your BFF apiUrl
    const isBff = req.url.startsWith(environment.apiUrl);
    if (!isBff) return next.handle(req);

    const cloned = req.clone({
      withCredentials: true,
      setHeaders: {
        'X-CSRF': '1',
        'X-Requested-With': 'XMLHttpRequest',
      }
    });

    return next.handle(cloned);
  }
}
