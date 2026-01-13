import Keycloak from 'keycloak-js';

export const keycloak = new Keycloak({
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8081',
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'memo',
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'memo-client',
});

let initPromise: Promise<boolean> | null = null;

export const initKeycloak = async (): Promise<boolean> => {
  if (initPromise) {
    return initPromise;
  }

  initPromise = keycloak.init({
    onLoad: 'login-required',
    checkLoginIframe: false,
    pkceMethod: 'S256',
  });

  const authenticated = await initPromise;

  if (authenticated) {
    // Refresh token every 5 minutes
    setInterval(() => {
      keycloak
        .updateToken(70)
        .then(refreshed => {
          if (refreshed) {
            // eslint-disable-next-line no-console
            console.log('Token refreshed');
          }
        })
        .catch(() => {
          // eslint-disable-next-line no-console
          console.error('Failed to refresh token');
          keycloak.login();
        });
    }, 300000);
  }

  return authenticated;
};

export const getToken = (): string | undefined => {
  return keycloak.token;
};

export const logout = () => {
  keycloak.logout();
};

export const getUserInfo = () => {
  return keycloak.tokenParsed;
};
