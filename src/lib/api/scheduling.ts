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
  relationshipId: string;
  success: boolean;
  updatedVotes: VoteCounts;
  newEntropy: number;
}

export const schedulingApi = {
  /** Fetches the next relationship task, or null if there are none left (HTTP 204). */
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

  /** Submits a vote for the given competency pair. */
  submitVote: async (
    userId: string,
    relationshipType: RelationshipType,
    originId: string,
    destinationId: string
  ): Promise<VoteResponse> => {
    const response = await apiClient.post<VoteResponse>(
      '/api/scheduling/vote',
      { originId, destinationId, relationshipType },
      { headers: { 'X-User-Id': userId } }
    );
    return response.data;
  },
};
