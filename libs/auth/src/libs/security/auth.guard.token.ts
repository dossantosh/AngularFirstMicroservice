import { InjectionToken, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { authGuardImpl } from './auth.guard';

/**
 * Token-based functional guard.
 * 
 * The DI lookups (AuthService, Router) are performed inside the guard
 * execution (when navigation runs), not at token factory time.
 * This guarantees a valid injection context and prevents NG0203.
 */
export const AUTH_GUARD: InjectionToken<CanActivateFn> =
  new InjectionToken<CanActivateFn>('AUTH_GUARD', {
    providedIn: 'root',
    factory: (): CanActivateFn => {
      return (_route, state) => {
        const auth = inject(AuthService);
        const router = inject(Router);
        return authGuardImpl(auth, router, state.url);
      };
    },
  });
