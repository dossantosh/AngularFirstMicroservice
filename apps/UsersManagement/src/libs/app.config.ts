import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { remoteRoutes } from './app.routes';

import { provideSharedErrorHandling } from '@angularFirstMicroservice/errors';
import { provideAnimations } from '@angular/platform-browser/animations';

import { authInterceptor } from '@angularFirstMicroservice/auth';

/**
 * Root Angular application configuration for the remote microfrontend.
 *
 * This configuration leverages Angular 20's standalone APIs to:
 * - Configure routing for the remote
 * - Set up HTTP client interceptors
 * - Enable client hydration (for SSR scenarios)
 * - Configure animations (both immediate and deferred)
 * - Apply global error handling with notifications
 * - Optimize zone change detection
 */
export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * Configures Angular's zone.js to coalesce multiple DOM events
     * into a single change detection cycle.
     * Reduces overhead during high-frequency event scenarios.
     */
    provideZoneChangeDetection({ eventCoalescing: true }),

    /**
     * Registers the remote application's routes using the
     * standalone Router API.
     */
    provideRouter(remoteRoutes),

    /**
     * Enables client-side hydration for server-side rendered (SSR) applications.
     * This reuses server-rendered DOM rather than replacing it, improving
     * startup performance.
     */
    provideClientHydration(),

    /**
     * Configures the HTTP client and attaches global interceptors.
     * In this case, the `authInterceptor` automatically adds the
     * Authorization header with the JWT for secured endpoints.
     */
    provideHttpClient(
      withInterceptors([
        authInterceptor,
      ])
    ),

    /**
     * Enables Angular's animation capabilities.
     * Required for Angular Material components and custom animations.
     */
    provideAnimations(),

    /**
     * Provides shared cross-cutting error handling features:
     * - HTTP error interceptor
     * - Snack-bar notifications
     * This is imported from the shared "errors" library so it can be
     * reused across shell and remotes.
     */
    provideSharedErrorHandling(),

    /**
     * Enables animations but loads the required animation
     * infrastructure asynchronously.
     * This can reduce the initial bundle size by deferring
     * animation setup until it’s actually needed.
     */
    provideAnimationsAsync(),
  ],
};
