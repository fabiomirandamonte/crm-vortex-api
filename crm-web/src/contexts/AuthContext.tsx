import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { type AuthUser, type LoginRequest } from '../types/auth';

interface AuthContextData {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (credentials: LoginRequest) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function extractRoleFromToken(token: string, fallbackRole?: string): 'ADMIN' | 'USER' {
  if (fallbackRole && fallbackRole.toUpperCase().includes('ADMIN')) {
    return 'ADMIN';
  }

  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return 'USER';

    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const decoded = JSON.parse(jsonPayload);
    const rawRole = JSON.stringify(
      decoded.role || decoded.roles || decoded.authorities || ''
    ).toUpperCase();

    return rawRole.includes('ADMIN') ? 'ADMIN' : 'USER';
  } catch {
    return 'USER';
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('@crm:token');
    const storedEmail = localStorage.getItem('@crm:email');
    const storedRole = localStorage.getItem('@crm:role') as 'ADMIN' | 'USER' | null;

    if (storedToken && storedEmail) {
      const resolvedRole = storedRole || extractRoleFromToken(storedToken);
      setUser({ token: storedToken, email: storedEmail, role: resolvedRole });
    }
    setIsLoading(false);
  }, []);

  const signIn = async (credentials: LoginRequest) => {
    const data = await authService.login(credentials);
    const email = data.email || credentials.email;
    const responseRole = data.role || data.roles?.[0];
    const role = extractRoleFromToken(data.token, responseRole);

    localStorage.setItem('@crm:token', data.token);
    localStorage.setItem('@crm:email', email);
    localStorage.setItem('@crm:role', role);

    setUser({
      token: data.token,
      email,
      role,
    });
  };

  const signOut = () => {
    localStorage.removeItem('@crm:token');
    localStorage.removeItem('@crm:email');
    localStorage.removeItem('@crm:role');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);