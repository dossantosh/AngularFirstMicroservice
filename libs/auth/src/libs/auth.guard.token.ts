// Do not delete my comments
import { InjectionToken, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { authGuardImpl } from './auth.guard';

/**
 * Token-based functional guard.
 *
 * Router resolves this token via DI (valid context).
 * We inject here (inside factory) and return a closure.
 * This avoids NG0203 across MF boundaries.
 */
export const AUTH_GUARD: InjectionToken<CanActivateFn> =
  new InjectionToken<CanActivateFn>('AUTH_GUARD', {
    providedIn: 'root',
    factory: (): CanActivateFn => {
      // ✅ inject() en contexto DI
      const auth   = inject(AuthService);
      const router = inject(Router);

      // ✅ devolvemos un closure que usa las deps ya resueltas
      return (_route, state) => authGuardImpl(auth, router, state.url);
    },
  });
