import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptor/auth.interceptor';
import { errorInterceptor } from './core/interceptor/error.interceptor';

/* provideClientHydration removed — only needed for SSR apps */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    /* Auth interceptor adds JWT token; error interceptor handles 401→login redirect */
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))
  ]
};
