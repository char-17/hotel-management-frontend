import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/* Global HTTP error handler — catches 401 responses and redirects to login.
   Clears stale auth data so the user gets a clean login form. */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        /* Token expired or invalid — clear auth state and force re-login */
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
