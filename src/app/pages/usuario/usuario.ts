import { DatePipe, JsonPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, decodeJwt } from '../../core/services/auth.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-usuario',
  imports: [DatePipe, JsonPipe],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
export class Usuario implements OnInit {
  private readonly router = inject(Router);
  private readonly toasts = inject(ToastService);
  protected readonly auth = inject(AuthService);

  protected readonly loading = signal(true);
  protected readonly loadError = signal<string | null>(null);
  protected readonly tokenVisible = signal(false);
  protected readonly copied = signal(false);

  protected readonly tokenText = computed(() => {
    const token = this.auth.token() ?? '';
    if (this.tokenVisible()) {
      return token;
    }
    return token.slice(0, 24) + '·'.repeat(48) + token.slice(-12);
  });

  protected readonly claims = computed(() => {
    const token = this.auth.token();
    return token ? decodeJwt(token) : null;
  });

  ngOnInit(): void {
    this.auth.loadCurrentUser().subscribe({
      next: () => this.loading.set(false),
      error: (err: Error) => {
        this.loading.set(false);
        this.loadError.set(err.message);
      },
    });
  }

  protected toggleToken(): void {
    this.tokenVisible.update((v) => !v);
  }

  protected async copyToken(): Promise<void> {
    const token = this.auth.token();
    if (!token) return;
    await navigator.clipboard.writeText(token);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  protected logout(): void {
    this.auth.logout().subscribe({
      next: () => {
        this.toasts.show('Sesión cerrada.');
        this.router.navigate(['/']);
      },
      error: () => {
        this.toasts.show('Sesión cerrada en este equipo.');
        this.router.navigate(['/']);
      },
    });
  }
}
