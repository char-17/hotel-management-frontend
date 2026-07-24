import { HttpInterceptorFn } from '@angular/common/http';

/* Functional interceptor: attaches JWT Bearer token to every outgoing request.
   Works with Angular standalone bootstrap via withInterceptors() in app.config.ts */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken');

  if (token) {
    /* Clone the request with the Authorization header so the backend JwtAuthFilter can validate it */
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
