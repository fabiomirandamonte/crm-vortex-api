export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type?: string;
  username?: string;
  roles?: string[];
}

export interface AuthUser {
  username: string;
  token: string;
}