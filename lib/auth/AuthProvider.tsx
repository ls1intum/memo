'use client';

import { createContext, useContext } from 'react';

interface UserInfo {
  email?: string;
  name?: string;
  preferred_username?: string;
  [key: string]: unknown;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserInfo | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: true,
  isLoading: false,
  user: { name: 'Guest User', preferred_username: 'guest' },
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // No authentication required - always authenticated as guest
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: true,
        isLoading: false,
        user: { name: 'Guest User', preferred_username: 'guest' },
        logout: () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
