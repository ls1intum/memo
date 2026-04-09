import Keycloak from 'keycloak-js';

export const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8081',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'memo',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'memo-client',
});

export async function initKeycloak(): Promise<boolean> {
  return keycloak.init({
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    silentCheckSsoRedirectUri:
      window.location.origin + '/silent-check-sso.html',
    checkLoginIframe: false,
  });
}
