import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export function errorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    catchError((error) => {
      // Manejo global de errores aquí
      console.error('Error interceptado:', error);
      // Puedes hacer lógica extra o lanzar un error personalizado
      return throwError(() => error);
    })
  );
}
