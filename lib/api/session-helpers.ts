/**
 * Session API helpers that provide server-action-like interfaces
 * for the session page to use with the Spring Boot API
 */

import { competenciesApi } from './competencies';
import { competencyRelationshipsApi } from './competency-relationships';
import { competencyResourceLinksApi } from './competency-resource-links';
import { learningResourcesApi } from './learning-resources';
import type {
  Competency,
  LearningResource,
  CompetencyRelationship,
  CompetencyResourceLink,
} from './types';

// User ID for unauthenticated access
const GUEST_USER_ID = 'guest';

// Get or create demo user - simplified since we use guest
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

// Get random competencies
export async function getRandomCompetenciesAction(count: number): Promise<{
  success: boolean;
  competencies?: Competency[];
  error?: string;
}> {
  try {
    const competencies = await competenciesApi.getRandom(count);
    if (!competencies || competencies.length === 0) {
      console.warn('No competencies returned from API');
      return {
        success: false,
        error: 'No competencies available. Please seed the database.',
      };
    }
    return { success: true, competencies };
  } catch (error) {
    console.error('Error fetching competencies:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to fetch competencies',
    };
  }
}

// Get random learning resource
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

// Create competency relationship
export async function createCompetencyRelationshipAction(
  formData: FormData
): Promise<{
  success: boolean;
  relationship?: CompetencyRelationship;
  error?: string;
}> {
  try {
    const relationshipType = formData.get('relationshipType') as string;
    const originId = formData.get('originId') as string;
    const destinationId = formData.get('destinationId') as string;

    const relationship = await competencyRelationshipsApi.create({
      relationshipType: relationshipType as 'ASSUMES' | 'EXTENDS' | 'MATCHES',
      originId,
      destinationId,
      userId: GUEST_USER_ID,
    });
    return { success: true, relationship };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create relationship',
    };
  }
}

// Delete competency relationship
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

// Create competency resource link
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
      matchType: matchType as 'ILLUSTRATIVE' | 'EXPLANATORY' | 'NECESSARY',
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

// Delete competency resource link
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
