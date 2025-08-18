// auth.interceptor.ts

import { inject } from '@angular/core';

import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpContextToken } from '@angular/common/http';

import { AuthService } from './auth.service';



export const BYPASS_AUTH = new HttpContextToken<boolean>(() => false);

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

  // const { usersManagementUrl } = inject(APP_ENV);
  const auth = inject(AuthService);
  const token = auth.getToken();

  if (req.context.get(BYPASS_AUTH)) {
    return next(req);
  }

  const isRelative = req.url.startsWith('/') || req.url.startsWith('./') || req.url.startsWith('../');
  // const isApiCall = req.url.startsWith(usersManagementUrl) || isRelative;

  // if (!token || !isApiCall) {
  //   return next(req);
  // }

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(authReq);
};
