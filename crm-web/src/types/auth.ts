export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type?: string;
  username?: string;
  email?: string;
  roles?: string[];
}

export interface AuthUser {
  username: string;
  email?: string;
  token: string;
}