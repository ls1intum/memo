/**
 * Session API helpers for the session page to use with the Spring Boot API
 */

import { competenciesApi } from './competencies';
import { competencyRelationshipsApi } from './competency-relationships';
import { competencyResourceLinksApi } from './competency-resource-links';
import { learningResourcesApi } from './learning-resources';
import { schedulingApi } from './scheduling';
import type {
  RelationshipTask,
  VoteResponse as SchedulingVoteResponse,
} from './scheduling';
import type {
  Competency,
  LearningResource,
  CompetencyResourceLink,
} from './types';

const GUEST_USER_ID = 'guest';

export async function getOrCreateDemoUserAction(): Promise<{
  success: boolean;
  user?: { id: string; name: string };
  error?: string;
}> {
  return {
    success: true,
    user: { id: GUEST_USER_ID, name: 'Guest User' },
  };
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
export async function getNextRelationshipTaskAction(userId: string): Promise<{
  success: boolean;
  task?: RelationshipTask;
  allDone?: boolean;
  error?: string;
}> {
  try {
    const task = await schedulingApi.getNextRelationship(userId);
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
 */
export async function submitCompetencyVoteAction(
  userId: string,
  relationshipId: string,
  relationshipType: string
): Promise<{
  success: boolean;
  voteResponse?: SchedulingVoteResponse;
  error?: string;
}> {
  try {
    const voteResponse = await schedulingApi.submitVote(
      userId,
      relationshipId,
      relationshipType
    );
    return { success: true, voteResponse };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit vote',
    };
  }
}

export async function getRandomLearningResourceAction(): Promise<{
  success: boolean;
  resource?: LearningResource;
  error?: string;
}> {
  try {
    const resources = await learningResourcesApi.getRandom(1);
    if (resources.length > 0) {
      return { success: true, resource: resources[0] };
    }
    return { success: false, error: 'No learning resources available' };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch learning resource',
    };
  }
}

export async function deleteCompetencyRelationshipAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await competencyRelationshipsApi.delete(id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to delete relationship',
    };
  }
}

export async function createCompetencyResourceLinkAction(
  formData: FormData
): Promise<{
  success: boolean;
  link?: CompetencyResourceLink;
  error?: string;
}> {
  try {
    const competencyId = formData.get('competencyId') as string;
    const resourceId = formData.get('resourceId') as string;
    const matchType = formData.get('matchType') as string;

    const link = await competencyResourceLinksApi.create({
      competencyId,
      resourceId,
      userId: GUEST_USER_ID,
      matchType: matchType as
        | 'UNRELATED'
        | 'WEAK'
        | 'GOOD_FIT'
        | 'PERFECT_MATCH',
    });
    return { success: true, link };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create resource link',
    };
  }
}

export async function deleteCompetencyResourceLinkAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await competencyResourceLinksApi.delete(id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to delete resource link',
    };
  }
}
