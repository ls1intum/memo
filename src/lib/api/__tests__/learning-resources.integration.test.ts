import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { learningResourcesApi } from '@/lib/api/learning-resources';
import {
  getUserToken,
  getAdminToken,
  authAs,
  clearAuth,
} from '@/test/fixtures';
import { deleteLearningResourcesByTitlePrefix } from '@/test/db-helpers';

const PREFIX = `[e2e-lr-${Date.now()}]`;
const URL_BASE = `https://example.test/e2e-${Date.now()}`;

describe('Learning Resources API', () => {
  beforeAll(async () => {
    const token = await getUserToken();
    authAs(token);
  });

  afterAll(async () => {
    clearAuth();
    await deleteLearningResourcesByTitlePrefix(PREFIX);
  });

  it('creates and reads back a learning resource', async () => {
    const created = await learningResourcesApi.create({
      title: `${PREFIX} create-test`,
      url: `${URL_BASE}/create`,
    });
    expect(created.id).toEqual(expect.any(String));
    expect(created.title).toBe(`${PREFIX} create-test`);
    expect(created.url).toBe(`${URL_BASE}/create`);

    const fetched = await learningResourcesApi.getById(created.id);
    expect(fetched.id).toBe(created.id);
  });

  it('finds a resource by URL', async () => {
    const url = `${URL_BASE}/byurl`;
    const created = await learningResourcesApi.create({
      title: `${PREFIX} by-url-test`,
      url,
    });
    const found = await learningResourcesApi.getByUrl(url);
    expect(found?.id).toBe(created.id);
  });

  it('returns null for a missing URL via getByUrl', async () => {
    const result = await learningResourcesApi.getByUrl(
      `${URL_BASE}/does-not-exist`
    );
    expect(result).toBeNull();
  });

  it('lists resources', async () => {
    const created = await learningResourcesApi.create({
      title: `${PREFIX} list-test`,
      url: `${URL_BASE}/list`,
    });
    const all = await learningResourcesApi.getAll();
    expect(all.some(r => r.id === created.id)).toBe(true);
  });

  it('updates a resource', async () => {
    const created = await learningResourcesApi.create({
      title: `${PREFIX} update-before`,
      url: `${URL_BASE}/update`,
    });
    const updated = await learningResourcesApi.update(created.id, {
      title: `${PREFIX} update-after`,
    });
    expect(updated.title).toBe(`${PREFIX} update-after`);
  });

  it('returns random resources', async () => {
    await learningResourcesApi.create({
      title: `${PREFIX} rand`,
      url: `${URL_BASE}/rand`,
    });
    const random = await learningResourcesApi.getRandom(1);
    expect(Array.isArray(random)).toBe(true);
  });

  it('blocks a non-admin user from deleting', async () => {
    const created = await learningResourcesApi.create({
      title: `${PREFIX} delete-denied`,
      url: `${URL_BASE}/del-denied`,
    });
    await expect(learningResourcesApi.delete(created.id)).rejects.toThrow();
  });

  it('allows an admin to delete a resource', async () => {
    const created = await learningResourcesApi.create({
      title: `${PREFIX} delete-allowed`,
      url: `${URL_BASE}/del-allowed`,
    });
    const adminToken = await getAdminToken();
    authAs(adminToken);
    await learningResourcesApi.delete(created.id);
    await expect(learningResourcesApi.getById(created.id)).rejects.toThrow();
    authAs(await getUserToken());
  });
});
