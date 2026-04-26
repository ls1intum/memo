import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { usersApi } from '@/lib/api/users';
import {
  getAdminToken,
  getUserToken,
  authAs,
  clearAuth,
} from '@/test/fixtures';
import { deleteUsersByEmailPrefix } from '@/test/db-helpers';

const PREFIX = `e2e-tmp-${Date.now()}`;

describe('Users API (admin only)', () => {
  beforeAll(async () => {
    const token = await getAdminToken();
    authAs(token);
  });

  afterAll(async () => {
    clearAuth();
    await deleteUsersByEmailPrefix(PREFIX);
  });

  it('creates a user', async () => {
    const created = await usersApi.create({
      name: 'Created User',
      email: `${PREFIX}-create@memo.local`,
      role: 'USER',
    });
    expect(created.id).toEqual(expect.any(String));
    expect(created.email).toBe(`${PREFIX}-create@memo.local`);
    expect(created.role).toBe('USER');
  });

  it('lists users including the e2e fixtures', async () => {
    const all = await usersApi.getAll();
    expect(all.some(u => u.email === 'e2e-admin@memo.local')).toBe(true);
    expect(all.some(u => u.email === 'e2e-user@memo.local')).toBe(true);
  });

  it('finds a user by email', async () => {
    const found = await usersApi.getByEmail('e2e-user@memo.local');
    expect(found?.email).toBe('e2e-user@memo.local');
  });

  it('returns null when getByEmail finds nothing', async () => {
    const found = await usersApi.getByEmail(
      `${PREFIX}-does-not-exist@memo.local`
    );
    expect(found).toBeNull();
  });

  it('updates a user', async () => {
    const created = await usersApi.create({
      name: 'Pre Update',
      email: `${PREFIX}-update@memo.local`,
    });
    const updated = await usersApi.update(created.id, { name: 'Post Update' });
    expect(updated.name).toBe('Post Update');
  });

  it('deletes a user', async () => {
    const created = await usersApi.create({
      name: 'To Delete',
      email: `${PREFIX}-delete@memo.local`,
    });
    await usersApi.delete(created.id);
    await expect(usersApi.getById(created.id)).rejects.toThrow();
  });

  it('blocks a non-admin user from listing users', async () => {
    const userToken = await getUserToken();
    authAs(userToken);
    await expect(usersApi.getAll()).rejects.toThrow();
    authAs(await getAdminToken());
  });

  it('allows a regular user to accept their own consent', async () => {
    const userToken = await getUserToken();
    authAs(userToken);
    const result = await usersApi.acceptConsent();
    expect(result.id).toEqual(expect.any(String));
    authAs(await getAdminToken());
  });
});
