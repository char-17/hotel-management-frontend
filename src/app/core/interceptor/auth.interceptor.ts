import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    let csrfToken = this.getCsrfToken();

    if (csrfToken) {
      request = request.clone({
        setHeaders: {
          'X-XSRF-TOKEN': csrfToken,
        },
        // This header name should match the one expected by the server
      });
    }
    return next.handle(request);
  }

  // Private method to extract the CSRF token from cookies
  private getCsrfToken(): string | null {
    // The name of the cookie storing the CSRF token
    const name = 'XSRF-TOKEN=';
    // Split the document.cookie string into individual cookies
    const ca = document.cookie.split(';');
    // Loop through each cookie
    for (let i = 0; i < ca.length; i++) {
      // Trim any whitespace from the current cookie
      const c = ca[i].trim();
      // Check if the current cookie starts with the token name
      if (c.indexOf(name) == 0) {
        // Return the value part of the cookie, which is the CSRF token
        return c.substring(name.length, c.length);
      }
    }
    // Return null if no matching cookie is found

    return null;
  }
}
