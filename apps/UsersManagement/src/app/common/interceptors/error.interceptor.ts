import { inject } from '@angular/core';

import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';

import { NotificationService } from '../services/notification.service';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function errorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const router = inject(Router);
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          notification.error('You are not authenticated. Please log in.');
          router.navigate(['/login']);
          break;

        case 403:
          notification.error('You do not have permission to perform this action.');
          router.navigate(['/access-denied']);
          break;

        case 404:
          notification.info('Resource not found.');
          router.navigate(['/not-found']);
          break;

        case 400: {
          const message = error.error?.message || 'Invalid data.';
          notification.error(message);
          break;
        }

        case 500:
          notification.error('Server error. Please try again later.');
          router.navigate(['/error']);
          break;

        default:
          notification.error(`Unexpected error: ${error.message}`);
          break;
      }

      return throwError(() => error);
    })
  );
}
