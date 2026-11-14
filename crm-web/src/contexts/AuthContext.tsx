import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { type AuthUser, type LoginRequest } from '../types/auth';

interface AuthContextData {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: LoginRequest) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('@crm:token');
    const storedUsername = localStorage.getItem('@crm:username');

    if (storedToken && storedUsername) {
      setUser({ token: storedToken, username: storedUsername });
    }
    setIsLoading(false);
  }, []);

  const signIn = async (credentials: LoginRequest) => {
    const data = await authService.login(credentials);
    const username = data.username || credentials.username;

    localStorage.setItem('@crm:token', data.token);
    localStorage.setItem('@crm:username', username);

    setUser({
      token: data.token,
      username,
    });
  };

  const signOut = () => {
    localStorage.removeItem('@crm:token');
    localStorage.removeItem('@crm:username');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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