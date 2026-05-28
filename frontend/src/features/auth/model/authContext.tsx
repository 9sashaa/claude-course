'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UserDto, AuthResponseDto } from '@expense-tracker/shared';

const TOKEN_KEY = 'auth_session';

interface AuthContextValue {
  user: UserDto | null;
  token: string | null;
  login: (data: AuthResponseDto) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      try {
        const parsed: AuthResponseDto = JSON.parse(stored);
        setToken(parsed.accessToken);
        setUser(parsed.user);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  }, []);

  const login = (data: AuthResponseDto) => {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(data));
    setToken(data.accessToken);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
