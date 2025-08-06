import { inject } from '@angular/core';

import { Router } from '@angular/router';

import { AuthService } from './auth.service';

import { firstValueFrom } from 'rxjs';

/**
 * Route guard to protect routes that require authentication.
 *
 * - Redirects to `/login` if no valid token is found.
 * - If the user is authenticated but `currentUser` is not yet loaded,
 *   it attempts to fetch the user's details from the backend.
 * - If fetching fails, it redirects to `/login`.
 *
 * @returns A boolean indicating whether navigation is allowed.
 */
export const authGuard = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Check if the user has a valid token
  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // Fetch the user from the backend if not already loaded
  if (!auth.currentUser) {
    try {
      await firstValueFrom(auth.fetchCurrentUser());
    } catch (err) {
      router.navigate(['/login']);
      return false;
    }
  }

  return true;
};
