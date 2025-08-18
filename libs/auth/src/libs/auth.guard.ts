import { Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { first, map, catchError, of, Observable } from 'rxjs';

/**
 * Pure authentication guard implementation (no direct Angular DI calls).
 *
 * This function encapsulates the guard's decision logic and can be called
 * from multiple contexts (e.g., different route files, unit tests) by passing
 * in the required dependencies explicitly.
 *
 * @param auth - The injected {@link AuthService} instance.
 * @param router - The injected Angular {@link Router} instance.
 * @param stateUrl - The target route URL being navigated to.
 * @returns `true` to allow navigation, a {@link UrlTree} to redirect, or an
 *          observable emitting either value.
 */
export function authGuardImpl(
  auth: AuthService,
  router: Router,
  stateUrl: string
): true | UrlTree | Observable<true | UrlTree> {
  // Prevent redirect loops if we're already on /login
  if (stateUrl.startsWith('/login')) return true;

  // If not logged in, redirect to login and preserve the attempted URL
  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login'], { queryParams: { redirectUrl: stateUrl } });
  }

  // Try to fetch current user if missing
  if (!auth.currentUser) {
    return auth.fetchCurrentUser().pipe(
      first(),
      // Ensure the service actually populated the user
      map((userOrNull): true | UrlTree => {
        if (!auth.currentUser && !userOrNull) {
          return router.createUrlTree(['/login'], { queryParams: { redirectUrl: stateUrl } });
        }
        return true;
      }),
      // If fetching fails, redirect to `/login`
      catchError((): Observable<true | UrlTree> =>
        of(router.createUrlTree(['/login'], { queryParams: { redirectUrl: stateUrl } }))
      )
    );
  }

  return true;
}
