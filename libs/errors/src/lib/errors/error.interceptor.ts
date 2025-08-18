import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * List of authentication-related paths where automatic redirects should be avoided
 * to prevent infinite redirect loops.
 */
const AUTH_PATHS = ['/login', '/refresh'];

/**
 * Global HTTP error interceptor for Angular applications.
 *
 * This interceptor:
 * - Catches HTTP errors for all outgoing requests
 * - Displays contextual snack-bar notifications to the user
 * - Optionally redirects to specific routes for certain HTTP status codes
 * - Avoids infinite loops by skipping redirects on authentication endpoints
 * - Detects platform to avoid navigation during SSR
 *
 * ### Error Handling Logic
 * - **0**   → Network error: notify user, no redirect
 * - **401** → Unauthorized: notify, optionally redirect to login
 * - **403** → Forbidden: notify, optionally redirect to access-denied
 * - **404** → Not found: notify, optionally redirect if not an API call
 * - **400** → Bad request: display server-provided message if available
 * - **500** → Server error: notify, optionally redirect to error page
 * - **Default** → Unknown error: show generic message
 *
 * ### Platform Awareness
 * Uses `isPlatformBrowser` to ensure that redirects only happen in the browser,
 * avoiding navigation errors during server-side rendering (SSR) or prerendering.
 *
 * ### Usage
 * Register in your app's `ApplicationConfig` via `provideHttpClient`:
 *
 * ```ts
 * provideHttpClient(withInterceptors([errorInterceptor]));
 * ```
 *
 * @param req The outgoing HTTP request
 * @param next The next HTTP handler in the chain
 * @returns An observable of the HTTP event stream, with error handling applied
 */
export function errorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const router = inject(Router);
  const notification = inject(NotificationService);
  const platformId = inject(PLATFORM_ID);
  const inBrowser = isPlatformBrowser(platformId);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle network/opaque errors explicitly
      if (error.status === 0) {
        notification.error('Network error. Check your connection.');
        return throwError(() => error);
      }

      // Only redirect in the browser and not for auth calls to prevent loops
      const safeToRedirect = inBrowser && !AUTH_PATHS.some(p => req.url.includes(p));

      switch (error.status) {
        case 401:
          notification.error('You are not authenticated. Please log in.');
          if (safeToRedirect) router.navigate(['/login']);
          break;

        case 403:
          notification.error('You do not have permission to perform this action.');
          if (safeToRedirect) router.navigate(['/access-denied']);
          break;

        case 404:
          notification.info('Resource not found.');
          // Optional: only redirect for navigational requests, not API calls
          if (safeToRedirect && !req.url.includes('/api/')) router.navigate(['/not-found']);
          break;

        case 400: {
          const message = error.error?.message || error.error?.title || 'Invalid data.';
          notification.error(message);
          break;
        }

        case 500:
          notification.error('Server error. Please try again later.');
          if (safeToRedirect) router.navigate(['/error']);
          break;

        default:
          notification.error(`Unexpected error: ${error.message}`);
          break;
      }

      // Re-throw so callers can still react
      return throwError(() => error);
    })
  );
}
