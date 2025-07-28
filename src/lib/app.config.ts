import {
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';

import { provideClientHydration } from '@angular/platform-browser';

import { authInterceptor } from '../app/auth/auth.interceptor';
import { errorInterceptor } from '../app/common/interceptors/error.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorInterceptor,
      ])
    ), provideAnimationsAsync(),
  ],
};
