/** Cuerpo que espera POST /api/auth/register */
export interface RegisterRequest {
  nombreCompleto: string;
  email: string;
  password: string;
}

/** Cuerpo que espera POST /api/auth/login */
export interface LoginRequest {
  email: string;
  password: string;
}

/** AuthResponseDto de la API */
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string | null;
  expiration: string;
  refreshToken?: string | null;
}

/** Respuesta de GET /api/auth/me */
export interface CurrentUser {
  id: string | null;
  email: string | null;
  nombre: string | null;
  roles: string[];
}
