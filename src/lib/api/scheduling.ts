import { apiClient } from './client';
import type { RelationshipType } from '@/components/session/session-constants';

export interface CompetencyInfo {
  id: string;
  title: string;
  description: string;
}

export interface VoteCounts {
  assumes: number;
  extendsRelation: number;
  matches: number;
  unrelated: number;
}

export interface RelationshipTask {
  relationshipId: string;
  origin: CompetencyInfo;
  destination: CompetencyInfo;
  pipeline: string;
  currentVotes: VoteCounts;
}

export interface VoteResponse {
  success: boolean;
  updatedVotes: VoteCounts;
  newEntropy: number;
}

export const schedulingApi = {
  /**
   * Get the next relationship task for a user.
   * Returns null when there are no more tasks (HTTP 204).
   */
  getNextRelationship: async (
    userId: string
  ): Promise<RelationshipTask | null> => {
    const response = await apiClient.get<RelationshipTask>(
      '/api/scheduling/next-relationship',
      { headers: { 'X-User-Id': userId } }
    );
    if (response.status === 204) {
      return null;
    }
    return response.data;
  },

  /**
   * Submit a vote on a relationship.
   * Pass relationshipId for normal votes, or originId+destinationId when swapped.
   */
  submitVote: async (
    userId: string,
    relationshipType: RelationshipType,
    opts: { relationshipId?: string; originId?: string; destinationId?: string }
  ): Promise<VoteResponse> => {
    const response = await apiClient.post<VoteResponse>(
      '/api/scheduling/vote',
      { ...opts, relationshipType },
      { headers: { 'X-User-Id': userId } }
    );
    return response.data;
  },
};
