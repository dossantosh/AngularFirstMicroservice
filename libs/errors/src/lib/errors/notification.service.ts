import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Service for displaying user notifications via Angular Material snack bars.
 *
 * Provides convenience methods for showing different types of messages
 * (error, success, info) with consistent styling and durations.
 *
 * ### Features
 * - Emoji prefix for visual clarity
 * - Distinct `panelClass` values for easy theming
 * - 3-second auto-dismiss for all messages
 * - Uses Angular's `inject()` API for standalone compatibility
 *
 * ### Usage
 * Inject into any component, service, or interceptor:
 * ```ts
 * constructor(private notification: NotificationService) {}
 *
 * this.notification.success('Profile updated successfully.');
 * this.notification.error('Unable to save changes.');
 * this.notification.info('New updates are available.');
 * ```
 *
 * @providedIn `root` – a singleton instance available application-wide
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  /** Angular Material snack-bar instance for displaying notifications. */
  private readonly snackBar = inject(MatSnackBar);

  /**
   * Displays an error notification.
   *
   * @param message The message to display
   */
  error(message: string) {
    this.snackBar.open(`❌ ${message}`, 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
  }

  /**
   * Displays a success notification.
   *
   * @param message The message to display
   */
  success(message: string) {
    this.snackBar.open(`✅ ${message}`, 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
  }

  /**
   * Displays an informational notification.
   *
   * @param message The message to display
   */
  info(message: string) {
    this.snackBar.open(`ℹ️ ${message}`, 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-info']
    });
  }
}
