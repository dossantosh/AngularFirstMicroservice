// auth.interceptor.ts

import { inject } from '@angular/core';

import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

import { AuthService } from './auth.service';

/**
 * HTTP interceptor that appends a JWT Authorization header to outgoing requests
 * if a token is available from the AuthService.
 *
 * This ensures protected endpoints receive the correct authentication credentials.
 *
 * @param req The outgoing HTTP request.
 * @param next The next handler in the request pipeline.
 * @returns An observable of the HTTP event stream.
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  const authReq = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      })
    : req;

  return next(authReq);
};
