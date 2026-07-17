import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protege /usuario: sin token válido no hay acceso, ni escribiendo la URL a mano.
 * (La protección real vive en la API; esto evita mostrar la pantalla.)
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  auth.clearSession();
  return router.createUrlTree(['/'], { queryParams: { sesion: 'requerida' } });
};
