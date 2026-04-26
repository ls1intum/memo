import { describe, it, expect, beforeAll } from 'vitest';
import { apiClient } from '@/lib/api/client';
import {
  getUserToken,
  getAdminToken,
  authAs,
  clearAuth,
} from '@/test/fixtures';

describe('Auth API', () => {
  beforeAll(async () => {
    await getUserToken();
    await getAdminToken();
  });

  it('returns 401 when no token is provided', async () => {
    clearAuth();
    await expect(apiClient.get('/api/auth/me')).rejects.toThrow();
  });

  it('returns the current user id and role for a regular user JWT', async () => {
    const token = await getUserToken();
    authAs(token);
    const response = await apiClient.get('/api/auth/me');
    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      id: expect.any(String),
      role: 'USER',
    });
  });

  it('returns ADMIN role for the admin JWT after promotion', async () => {
    const token = await getAdminToken();
    authAs(token);
    const response = await apiClient.get('/api/auth/me');
    expect(response.data).toMatchObject({
      id: expect.any(String),
      role: 'ADMIN',
    });
  });
});
