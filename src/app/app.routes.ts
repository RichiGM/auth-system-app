import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Auth System',
    loadComponent: () => import('./pages/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'usuario',
    title: 'Mi cuenta · Auth System',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/usuario/usuario').then((m) => m.Usuario),
  },
  { path: '**', redirectTo: '' },
];
