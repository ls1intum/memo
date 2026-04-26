import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { competenciesApi } from '@/lib/api/competencies';
import { learningResourcesApi } from '@/lib/api/learning-resources';
import { competencyResourceLinksApi } from '@/lib/api/competency-resource-links';
import {
  getUserToken,
  getUserId,
  authAs,
  clearAuth,
} from '@/test/fixtures';
import {
  deleteCompetenciesByTitlePrefix,
  deleteLearningResourcesByTitlePrefix,
} from '@/test/db-helpers';

const PREFIX = `[e2e-link-${Date.now()}]`;
const URL_BASE = `https://example.test/e2e-link-${Date.now()}`;

describe('Competency Resource Links API', () => {
  beforeAll(async () => {
    const token = await getUserToken();
    authAs(token);
  });

  afterAll(async () => {
    clearAuth();
    await deleteCompetenciesByTitlePrefix(PREFIX);
    await deleteLearningResourcesByTitlePrefix(PREFIX);
  });

  it('creates and reads back a link', async () => {
    const competency = await competenciesApi.create({
      title: `${PREFIX} link-comp`,
    });
    const resource = await learningResourcesApi.create({
      title: `${PREFIX} link-res`,
      url: `${URL_BASE}/a`,
    });
    const userId = await getUserId();

    const created = await competencyResourceLinksApi.create({
      competencyId: competency.id,
      resourceId: resource.id,
      userId,
      matchType: 'GOOD_FIT',
    });
    expect(created.id).toEqual(expect.any(String));
    expect(created.competencyId).toBe(competency.id);
    expect(created.resourceId).toBe(resource.id);
    expect(created.matchType).toBe('GOOD_FIT');

    const fetched = await competencyResourceLinksApi.getById(created.id);
    expect(fetched.id).toBe(created.id);
  });

  it('lists links', async () => {
    const all = await competencyResourceLinksApi.getAll();
    expect(Array.isArray(all)).toBe(true);
  });

  it('deletes a link', async () => {
    const competency = await competenciesApi.create({
      title: `${PREFIX} link-del-comp`,
    });
    const resource = await learningResourcesApi.create({
      title: `${PREFIX} link-del-res`,
      url: `${URL_BASE}/del`,
    });
    const userId = await getUserId();
    const link = await competencyResourceLinksApi.create({
      competencyId: competency.id,
      resourceId: resource.id,
      userId,
      matchType: 'WEAK',
    });
    await competencyResourceLinksApi.delete(link.id);
    await expect(
      competencyResourceLinksApi.getById(link.id)
    ).rejects.toThrow();
  });
});
