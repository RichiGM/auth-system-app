import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, CurrentUser, LoginRequest, RegisterRequest } from '../models/auth.models';

const TOKEN_KEY = 'auth_system_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/auth`;

  /** Token JWT vigente (o null). Se rehidrata desde localStorage al recargar. */
  readonly token = signal<string | null>(this.readStoredToken());

  /** Datos del usuario autenticado, tal como los devuelve /api/auth/me. */
  readonly user = signal<CurrentUser | null>(null);

  /** Única fuente de verdad para rutas protegidas y para la UI. */
  readonly isAuthenticated = computed(() => {
    const token = this.token();
    return token !== null && !isExpired(token);
  });

  /** Fecha de expiración del token, leída del claim `exp`. */
  readonly tokenExpiresAt = computed(() => {
    const token = this.token();
    return token ? expirationOf(token) : null;
  });

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.api}/register`, payload)
      .pipe(catchError(toReadableError));
  }

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/login`, payload).pipe(
      tap((res) => {
        if (res.success && res.token) {
          this.storeToken(res.token);
        }
      }),
      catchError(toReadableError),
    );
  }

  /** Carga el perfil del usuario autenticado. */
  loadCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${this.api}/me`).pipe(
      tap((user) => this.user.set(user)),
      catchError(toReadableError),
    );
  }

  /**
   * Cierra sesión: invalida el refresh token en la API y limpia el estado local.
   * La API responde texto plano, por eso `responseType: 'text'`.
   */
  logout(): Observable<string> {
    return this.http.post(`${this.api}/logout`, {}, { responseType: 'text' }).pipe(
      tap(() => this.clearSession()),
      catchError((error) => {
        // Aunque la API falle, la sesión local debe quedar limpia.
        this.clearSession();
        return toReadableError(error);
      }),
    );
  }

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.token.set(null);
    this.user.set(null);
  }

  private storeToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.token.set(token);
  }

  private readStoredToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || isExpired(token)) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return token;
  }
}

/** Decodifica el payload de un JWT (base64url) sin librerías externas. */
export function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function expirationOf(token: string): Date | null {
  const exp = decodeJwt(token)?.['exp'];
  return typeof exp === 'number' ? new Date(exp * 1000) : null;
}

function isExpired(token: string): boolean {
  const expiresAt = expirationOf(token);
  return expiresAt === null || expiresAt.getTime() <= Date.now();
}

/** Traduce cualquier fallo HTTP a un mensaje que el usuario pueda entender. */
function toReadableError(error: unknown): Observable<never> {
  if (!(error instanceof HttpErrorResponse)) {
    return throwError(() => new Error('Ocurrió un error inesperado.'));
  }
  if (error.status === 0) {
    return throwError(
      () =>
        new Error(
          'No se pudo contactar la API. Revisa que esté corriendo y que la URL en environment sea la correcta.',
        ),
    );
  }
  const body = error.error;
  const message =
    (typeof body === 'object' &&
      body !== null &&
      'message' in body &&
      (body as AuthResponse).message) ||
    (typeof body === 'string' && body) ||
    'Ocurrió un error al procesar la solicitud.';
  return throwError(() => new Error(message));
}
