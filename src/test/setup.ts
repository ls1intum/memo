import { vi } from 'vitest';

vi.mock('@/lib/auth/keycloak', () => ({
  keycloak: { authenticated: false, token: undefined },
  initKeycloak: vi.fn(),
}));
