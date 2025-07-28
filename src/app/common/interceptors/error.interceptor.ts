// error.interceptor.ts

import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * HTTP interceptor that handles global HTTP errors.
 *
 * Based on the HTTP status code, it displays appropriate snack bar messages
 * and performs navigation actions such as redirecting to login or error pages.
 *
 * Handles:
 * - 401 Unauthorized
 * - 403 Forbidden
 * - 404 Not Found
 * - 400 Bad Request (including validation messages)
 * - 500 Internal Server Error
 * - Other unexpected errors
 *
 * @param req The outgoing HTTP request.
 * @param next The next handler in the interceptor chain.
 * @returns An observable of the HTTP event stream with error handling applied.
 */
export function errorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          snackBar.open('⚠️ You are not authenticated. Please log in.', 'Close', { duration: 4000 });
          router.navigate(['/login']);
          break;

        case 403:
          snackBar.open('⛔ You do not have permission to perform this action.', 'Close', { duration: 4000 });
          router.navigate(['/access-denied']);
          break;

        case 404:
          snackBar.open('❓ Resource not found.', 'Close', { duration: 3000 });
          router.navigate(['/not-found']);
          break;

        case 400: {
          // Display validation or general client error
          const message = error.error?.message || 'Invalid data.';
          snackBar.open(`❗ ${message}`, 'Close', { duration: 3000 });
          break;
        }

        case 500:
          snackBar.open('💥 Server error. Please try again later.', 'Close', { duration: 4000 });
          router.navigate(['/error']);
          break;

        default:
          snackBar.open(`Unexpected error: ${error.message}`, 'Close', { duration: 3000 });
          break;
      }

      return throwError(() => error);
    })
  );
}
