import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideSharedErrorHandling } from '@angularFirstMicroservice/errors';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@angularFirstMicroservice/auth';


/**
 * Root application configuration for the shell.
 *
 * This configuration sets up:
 * - Global error handling
 * - Optimized change detection
 * - Routing
 * - HTTP client with authentication interceptor
 * - Animations for Angular Material
 * - Shared error handling (notifications + error interceptor)
 * - Environment configuration for backend services
 */
export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * Registers global error listeners for unhandled errors and promise rejections.
     * Useful for logging, monitoring, and displaying fallback UIs.
     */
    provideBrowserGlobalErrorListeners(),

    /**
     * Configures Angular change detection to coalesce events,
     * reducing the number of change detection cycles triggered
     * during high-frequency DOM events.
     */
    provideZoneChangeDetection({ eventCoalescing: true }),

    /**
     * Configures the application router with the defined routes.
     * Uses the standalone router API (no NgModules).
     */
    provideRouter(routes),

    /**
     * Configures the HTTP client and attaches the authentication interceptor
     * for adding auth headers to outgoing requests.
     */
    provideHttpClient(withInterceptors([authInterceptor])),

    /**
     * Enables Angular's animation capabilities.
     * Required by Angular Material components that use animations.
     */
    provideAnimations(),

    /**
     * Provides shared error handling for the app.
     * This includes:
     * - Global error interceptor for HTTP requests
     * - NotificationService for user-friendly messages via snack bars
     */
    provideSharedErrorHandling(),
  ],
};
