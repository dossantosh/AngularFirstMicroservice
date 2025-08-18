import { importProvidersFrom, makeEnvironmentProviders } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './error.interceptor';

/**
 * Provides shared cross-cutting error handling for Angular applications.
 *
 * This function registers:
 * - **MatSnackBarModule**: Enables Angular Material snack-bar UI
 *   for displaying user-friendly notifications.
 * - **HTTP error interceptor**: Catches HTTP errors globally
 *   and displays contextual messages using `NotificationService`.
 *
 * ### Features
 * - Centralized error handling across all HTTP requests
 * - User-friendly toast/snack-bar notifications for error cases
 * - Can be reused across shell and remote microfrontends
 *
 * ### Usage
 * Call this function inside an application's `ApplicationConfig`:
 *
 * ```ts
 * import { provideSharedErrorHandling } from '@your-org/shared/errors';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideSharedErrorHandling(),
 *   ],
 * };
 * ```
 *
 * @returns Environment providers for snack-bar notifications
 *          and global HTTP error interception.
 */
export function provideSharedErrorHandling() {
  return makeEnvironmentProviders([
    importProvidersFrom(MatSnackBarModule),
    provideHttpClient(withInterceptors([errorInterceptor])),
  ]);
}
