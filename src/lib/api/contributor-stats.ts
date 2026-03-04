import { apiClient } from './client';

export interface DailyCount {
  date: string;
  count: number;
}

export interface ContributorStats {
  totalVotes: number;
  currentStreak: number;
  longestStreak: number;
  dailyCounts: DailyCount[];
  earnedBadges: string[];
}

export const contributorStatsApi = {
  getStats: async (userId: string): Promise<ContributorStats> => {
    const response = await apiClient.get<ContributorStats>(
      `/api/users/${userId}/stats`
    );
    return response.data;
  },
};
