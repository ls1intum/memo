import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { competenciesApi } from '@/lib/api/competencies';
import { competencyRelationshipsApi } from '@/lib/api/competency-relationships';
import { schedulingApi } from '@/lib/api/scheduling';
import { getUserToken, getUserId, authAs, clearAuth } from '@/test/fixtures';
import { deleteCompetenciesByTitlePrefix } from '@/test/db-helpers';

const PREFIX = `[e2e-rel-${Date.now()}]`;

describe('Competency Relationships API', () => {
  beforeAll(async () => {
    const token = await getUserToken();
    authAs(token);
  });

  afterAll(async () => {
    clearAuth();
    await deleteCompetenciesByTitlePrefix(PREFIX);
  });

  it('lists relationships', async () => {
    const all = await competencyRelationshipsApi.getAll();
    expect(Array.isArray(all)).toBe(true);
  });

  it('creates a relationship via voting and reads it back by id', async () => {
    const a = await competenciesApi.create({ title: `${PREFIX} A` });
    const b = await competenciesApi.create({ title: `${PREFIX} B` });
    const userId = await getUserId();

    const vote = await schedulingApi.submitVote(userId, 'EXTENDS', {
      originId: a.id,
      destinationId: b.id,
    });
    expect(vote.relationshipId).toEqual(expect.any(String));

    const fetched = await competencyRelationshipsApi.getById(
      vote.relationshipId
    );
    expect(fetched.id).toBe(vote.relationshipId);
    expect(fetched.originId).toBe(a.id);
    expect(fetched.destinationId).toBe(b.id);
  });

  it('returns 404 for an unknown relationship id', async () => {
    await expect(
      competencyRelationshipsApi.getById('does-not-exist-123')
    ).rejects.toThrow();
  });
});
