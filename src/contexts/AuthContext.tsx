import { useEffect, useRef, useState, type ReactNode } from 'react';
import { keycloak, initKeycloak } from '../lib/auth/keycloak';
import { AuthContext } from './auth-context';

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
    let onboarded = false;
    try {
      onboarded = !!localStorage.getItem('memo-onboarded');
    } catch {
      /* ignore */
    }
    keycloak.login({
      redirectUri:
        window.location.origin + (onboarded ? '/session' : '/onboarding'),
    });
  }

  function onboardingLogin() {
    keycloak.login({
      redirectUri: window.location.origin + '/onboarding?step=2',
    });
  }

  function logout() {
    keycloak.logout({ redirectUri: window.location.origin + '/' });
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
        onboardingLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
