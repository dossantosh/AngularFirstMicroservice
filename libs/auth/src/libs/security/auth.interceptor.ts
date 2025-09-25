import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpContextToken } from '@angular/common/http';
import { AuthService } from './auth.service';

export const BYPASS_AUTH = new HttpContextToken<boolean>(() => false);

/**
 * HTTP interceptor that appends a JWT Authorization header to outgoing requests
 * if a token is available from the AuthService and the request targets an API endpoint.
 *
 * Prevents attaching tokens to non-API or external requests (assets, CDNs, etc.).
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  if (req.context.get(BYPASS_AUTH)) {
    return next(req);
  }

  // Only attach tokens to your own backend API calls
  const isApiCall =
    req.url.startsWith('/api-') || req.url.startsWith('/api/');

  if (!token || !isApiCall) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authReq);
};
