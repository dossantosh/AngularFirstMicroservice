import {
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';

import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { errorInterceptor } from '../app/common/interceptors/error.interceptor';
import { authInterceptor } from '@angularFirstMicroservice/auth';

/**
 * Global Angular application configuration.
 * 
 * This configuration is used with standalone APIs to bootstrap the app,
 * including routing, HTTP interceptors, animations, and zone settings.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Improves performance by coalescing DOM events inside Angular's zone
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Registers the application's route definitions
    provideRouter(routes),

    // Enables client-side hydration for server-side rendered (SSR) apps
    provideClientHydration(),

    // Registers HTTP client with global interceptors
    provideHttpClient(
      withInterceptors([
        authInterceptor,  // Adds Authorization header with JWT
        errorInterceptor, // Handles HTTP error responses globally
      ])
    ),

    // Provides animations with deferred loading to reduce initial bundle size
    provideAnimationsAsync(),
  ],
};
