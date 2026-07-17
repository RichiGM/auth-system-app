import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Agrega `Authorization: Bearer <token>` a las llamadas a nuestra API.
 * Registro y login se excluyen porque son endpoints anónimos.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  const isAnonymous = req.url.includes('/auth/login') || req.url.includes('/auth/register');

  if (!token || isAnonymous) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
