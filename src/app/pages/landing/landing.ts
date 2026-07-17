import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginForm } from '../../features/auth/login-form/login-form';
import { RegisterForm } from '../../features/auth/register-form/register-form';
import { Modal } from '../../shared/modal/modal';
import { ToastService } from '../../shared/toast/toast.service';

type Dialog = 'registro' | 'login' | null;

@Component({
  selector: 'app-landing',
  imports: [Modal, RegisterForm, LoginForm],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  private readonly router = inject(Router);
  private readonly toasts = inject(ToastService);

  protected readonly dialog = signal<Dialog>(null);

  constructor() {
    // El guard manda aquí con ?sesion=requerida cuando alguien intenta abrir /usuario sin token.
    if (this.router.parseUrl(this.router.url).queryParams['sesion'] === 'requerida') {
      this.toasts.show('Inicia sesión para ver tu cuenta.', 'error');
      this.router.navigate([], { queryParams: {} });
    }
  }

  protected open(dialog: Exclude<Dialog, null>): void {
    this.dialog.set(dialog);
  }

  protected close(): void {
    this.dialog.set(null);
  }

  /** Paso 2 del enunciado: avisar y volver a la landing. */
  protected onRegistered(message: string): void {
    this.close();
    this.toasts.show(`${message} Ya puedes iniciar sesión.`);
  }

  /** Paso 4: sesión iniciada, se pasa a la ruta protegida. */
  protected onLoggedIn(): void {
    this.close();
    this.router.navigate(['/usuario']);
  }
}
