import { apiClient } from './client';
import type { ResourceMatchType } from '@/components/session/session-constants';

export interface ResourceCompetencyInfo {
  id: string;
  title: string;
  description: string;
}

export interface ResourceInfo {
  id: string;
  title: string;
  url: string;
}

export interface ResourceVoteCounts {
  unrelated: number;
  weak: number;
  goodFit: number;
  perfectMatch: number;
}

export interface ResourceTask {
  mappingId: string | null;
  competency: ResourceCompetencyInfo;
  resource: ResourceInfo;
  pipeline: string;
  currentVotes: ResourceVoteCounts;
}

export interface ResourceVoteResponse {
  mappingId: string;
  success: boolean;
  updatedVotes: ResourceVoteCounts;
  newEntropy: number;
}

export const resourceSchedulingApi = {
  /**
   * Get the next competency↔resource task for a user.
   * Returns null when there are no more tasks (HTTP 204).
   */
  getNextTask: async (
    userId: string,
    skippedIds?: string[]
  ): Promise<ResourceTask | null> => {
    const params = new URLSearchParams();
    if (skippedIds && skippedIds.length > 0) {
      skippedIds.forEach(id => params.append('skippedIds', id));
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';

    const response = await apiClient.get<ResourceTask>(
      `/api/scheduling/resource/next-task${queryString}`,
      { headers: { 'X-User-Id': userId } }
    );
    if (response.status === 204) {
      return null;
    }
    return response.data;
  },

  /**
   * Submit a vote on a competency↔resource mapping.
   * Pass mappingId for existing mappings, or competencyId+resourceId for new pairs.
   */
  submitVote: async (
    userId: string,
    matchType: ResourceMatchType,
    opts: { mappingId?: string; competencyId?: string; resourceId?: string }
  ): Promise<ResourceVoteResponse> => {
    const response = await apiClient.post<ResourceVoteResponse>(
      '/api/scheduling/resource/vote',
      { ...opts, matchType },
      { headers: { 'X-User-Id': userId } }
    );
    return response.data;
  },

  unvote: async (userId: string, mappingId: string): Promise<void> => {
    await apiClient.delete(`/api/scheduling/resource/vote/${mappingId}`, {
      headers: { 'X-User-Id': userId },
    });
  },
};
