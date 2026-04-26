import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { contributorStatsApi } from '@/lib/api/contributor-stats';
import {
  getUserToken,
  getUserId,
  authAs,
  clearAuth,
} from '@/test/fixtures';

describe('Contributor Stats API', () => {
  beforeAll(async () => {
    const token = await getUserToken();
    authAs(token);
  });

  afterAll(() => {
    clearAuth();
  });

  it('returns stats for the current user matching the response shape', async () => {
    const userId = await getUserId();
    const stats = await contributorStatsApi.getStats(userId);

    expect(stats).toMatchObject({
      totalVotes: expect.any(Number),
      currentStreak: expect.any(Number),
      longestStreak: expect.any(Number),
      dailyCounts: expect.any(Array),
      earnedBadges: expect.any(Array),
    });
    if (stats.dailyCounts.length > 0) {
      expect(stats.dailyCounts[0]).toMatchObject({
        date: expect.any(String),
        count: expect.any(Number),
      });
    }
  });
});
