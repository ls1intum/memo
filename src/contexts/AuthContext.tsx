import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { keycloak, initKeycloak } from '../lib/auth/keycloak';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  role: string | null;
  domainError: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [domainError, setDomainError] = useState(false);
  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;

    initKeycloak()
      .then(async authenticated => {
        setIsAuthenticated(authenticated);
        if (authenticated) {
          await syncUser();
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));

    keycloak.onTokenExpired = () => {
      keycloak.updateToken(60).catch(() => {
        setIsAuthenticated(false);
        setUserId(null);
        setRole(null);
      });
    };
  }, []);

  async function syncUser() {
    try {
      const res = await fetch(
        (import.meta.env.VITE_API_URL || 'http://localhost:8080') +
          '/api/auth/me',
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setUserId(data.id);
        setRole(data.role);
      } else if (res.status === 403) {
        setDomainError(true);
      }
    } catch {
      // non-critical: user is still authenticated, just not synced
    }
  }

  function login() {
    keycloak.login({ redirectUri: window.location.origin + '/session' });
  }

  function logout() {
    keycloak.logout({ redirectUri: window.location.origin + '/login' });
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        userId,
        role,
        domainError,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
