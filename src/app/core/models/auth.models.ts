export interface RegisterRequest {
  nombreCompleto: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string | null;
  expiration: string;
  refreshToken?: string | null;
}

export interface CurrentUser {
  id: string | null;
  email: string | null;
  nombre: string | null;
  roles: string[];
}
