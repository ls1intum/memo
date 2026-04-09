import { createContext } from 'react';

export interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  role: string | null;
  domainError: boolean;
  login: () => void;
  onboardingLogin: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
