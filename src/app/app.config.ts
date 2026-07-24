import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app-routing.module';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptor/auth.interceptor';
import { errorInterceptor } from './core/interceptor/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    /* Auth interceptor adds JWT token; error interceptor handles 401→login redirect */
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))
  ]
};
