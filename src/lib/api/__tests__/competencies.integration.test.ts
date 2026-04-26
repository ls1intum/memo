import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { competenciesApi } from '@/lib/api/competencies';
import {
  getUserToken,
  getAdminToken,
  authAs,
  clearAuth,
} from '@/test/fixtures';
import { deleteCompetenciesByTitlePrefix } from '@/test/db-helpers';

const PREFIX = `[e2e-comp-${Date.now()}]`;

describe('Competencies API', () => {
  beforeAll(async () => {
    const token = await getUserToken();
    authAs(token);
  });

  afterAll(async () => {
    clearAuth();
    await deleteCompetenciesByTitlePrefix(PREFIX);
  });

  it('creates and reads back a competency', async () => {
    const created = await competenciesApi.create({
      title: `${PREFIX} create-test`,
      description: 'integration test',
    });
    expect(created.id).toEqual(expect.any(String));
    expect(created.title).toBe(`${PREFIX} create-test`);
    expect(created.description).toBe('integration test');
    expect(created.createdAt).toEqual(expect.any(String));

    const fetched = await competenciesApi.getById(created.id);
    expect(fetched).toMatchObject({
      id: created.id,
      title: created.title,
    });
  });

  it('lists competencies and includes the one we created', async () => {
    const created = await competenciesApi.create({
      title: `${PREFIX} list-test`,
    });
    const all = await competenciesApi.getAll();
    expect(Array.isArray(all)).toBe(true);
    expect(all.some(c => c.id === created.id)).toBe(true);
  });

  it('updates a competency', async () => {
    const created = await competenciesApi.create({
      title: `${PREFIX} update-before`,
    });
    const updated = await competenciesApi.update(created.id, {
      title: `${PREFIX} update-after`,
      description: 'changed',
    });
    expect(updated.title).toBe(`${PREFIX} update-after`);
    expect(updated.description).toBe('changed');
  });

  it('returns random competencies', async () => {
    await competenciesApi.create({ title: `${PREFIX} rand-1` });
    await competenciesApi.create({ title: `${PREFIX} rand-2` });
    const random = await competenciesApi.getRandom(2);
    expect(Array.isArray(random)).toBe(true);
    expect(random.length).toBeLessThanOrEqual(2);
  });

  it('blocks a non-admin user from deleting', async () => {
    const created = await competenciesApi.create({
      title: `${PREFIX} delete-denied`,
    });
    await expect(competenciesApi.delete(created.id)).rejects.toThrow();
  });

  it('allows an admin to delete a competency', async () => {
    const created = await competenciesApi.create({
      title: `${PREFIX} delete-allowed`,
    });
    const adminToken = await getAdminToken();
    authAs(adminToken);
    await competenciesApi.delete(created.id);
    await expect(competenciesApi.getById(created.id)).rejects.toThrow();
    authAs(await getUserToken());
  });
});
