// error.interceptor.ts

import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
          snackBar.open('⚠️ No estás autenticado. Por favor inicia sesión.', 'Cerrar', { duration: 4000 });
          router.navigate(['/login']);
          break;

        case 403:
          snackBar.open('⛔ No tienes permisos para esta acción.', 'Cerrar', { duration: 4000 });
          router.navigate(['/acceso-denegado']);
          break;

        case 404:
          snackBar.open('❓ Recurso no encontrado.', 'Cerrar', { duration: 3000 });
          router.navigate(['/no-encontrado']);
          break;

        case 400: {
          // Mostrar validación u otro error "menor"
          const message = error.error?.message || 'Datos inválidos';
          snackBar.open(`❗ ${message}`, 'Cerrar', { duration: 3000 });
          break;
        }

        case 500:
          snackBar.open('💥 Error del servidor. Inténtalo más tarde.', 'Cerrar', { duration: 4000 });
          router.navigate(['/error']);
          break;

        default:
          snackBar.open(`Error inesperado: ${error.message}`, 'Cerrar', { duration: 3000 });
          break;
      }
      return throwError(() => error);
    })
  );
}
