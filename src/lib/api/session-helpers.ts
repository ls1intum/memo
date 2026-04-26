/**
 * Session API helpers for the session page to use with the Spring Boot API
 */

import { apiClient } from './client';
import { competenciesApi } from './competencies';
import { resourceSchedulingApi } from './resource-scheduling';
import { schedulingApi } from './scheduling';
import type {
  RelationshipTask,
  VoteResponse as SchedulingVoteResponse,
} from './scheduling';
import type {
  ResourceTask,
  ResourceVoteResponse as ResourceSchedulingVoteResponse,
} from './resource-scheduling';
import type { Competency } from './types';
import type {
  RelationshipType,
  ResourceMatchType,
} from '@/components/session/session-constants';

export async function getCurrentUserAction(): Promise<{
  success: boolean;
  user?: { id: string; role: string };
  error?: string;
}> {
  try {
    const response = await apiClient.get<{ id: string; role: string }>(
      '/api/auth/me'
    );
    return { success: true, user: response.data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to get current user',
    };
  }
}

export async function getRandomCompetenciesAction(count: number): Promise<{
  success: boolean;
  competencies?: Competency[];
  error?: string;
}> {
  try {
    const competencies = await competenciesApi.getRandom(count);
    if (!competencies || competencies.length === 0) {
      return {
        success: false,
        error: 'No competencies available. Please seed the database.',
      };
    }
    return { success: true, competencies };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to fetch competencies',
    };
  }
}

/**
 * Get the next relationship task from the scheduling pipeline.
 * Returns allDone: true when there are no more pairs to vote on.
 */
export async function getNextRelationshipTaskAction(
  userId: string,
  skippedIds?: string[]
): Promise<{
  success: boolean;
  task?: RelationshipTask;
  allDone?: boolean;
  error?: string;
}> {
  try {
    const task = await schedulingApi.getNextRelationship(userId, skippedIds);
    if (task === null) {
      return { success: true, allDone: true };
    }
    return { success: true, task };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch next relationship task',
    };
  }
}

/**
 * Submit a vote on a competency relationship via the scheduling pipeline.
 * Pass opts.relationshipId for normal votes, or opts.originId+opts.destinationId when swapped.
 */
export async function submitCompetencyVoteAction(
  userId: string,
  relationshipType: RelationshipType,
  opts: { relationshipId?: string; originId?: string; destinationId?: string }
): Promise<{
  success: boolean;
  voteResponse?: SchedulingVoteResponse;
  error?: string;
}> {
  try {
    const voteResponse = await schedulingApi.submitVote(
      userId,
      relationshipType,
      opts
    );
    return { success: true, voteResponse };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit vote',
    };
  }
}

export async function unvoteAction(
  userId: string,
  relationshipId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await schedulingApi.unvote(userId, relationshipId);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to undo vote',
    };
  }
}

/**
 * Get the next competency↔resource task from the resource scheduling pipeline.
 * Returns allDone: true when there are no more pairs to vote on.
 */
export async function getNextResourceTaskAction(
  userId: string,
  skippedIds?: string[]
): Promise<{
  success: boolean;
  task?: ResourceTask;
  allDone?: boolean;
  error?: string;
}> {
  try {
    const task = await resourceSchedulingApi.getNextTask(userId, skippedIds);
    if (task === null) {
      return { success: true, allDone: true };
    }
    return { success: true, task };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch next resource task',
    };
  }
}

/**
 * Submit a match-quality vote on a competency↔resource mapping.
 * Pass opts.mappingId for existing mappings, or opts.competencyId+opts.resourceId for new pairs.
 */
export async function submitResourceVoteAction(
  userId: string,
  matchType: ResourceMatchType,
  opts: { mappingId?: string; competencyId?: string; resourceId?: string }
): Promise<{
  success: boolean;
  voteResponse?: ResourceSchedulingVoteResponse;
  error?: string;
}> {
  try {
    const voteResponse = await resourceSchedulingApi.submitVote(
      userId,
      matchType,
      opts
    );
    return { success: true, voteResponse };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit vote',
    };
  }
}

export async function unvoteResourceAction(
  userId: string,
  mappingId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await resourceSchedulingApi.unvote(userId, mappingId);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to undo resource vote',
    };
  }
}
