'use server';

import { competencyRelationshipService } from '@/lib/services/competency_relationship';
import { RelationshipType } from '@/lib/domain/domain_core';

export async function createCompetencyRelationshipAction(formData: FormData) {
  try {
    const relationshipType = formData.get(
      'relationshipType'
    ) as RelationshipType | null;
    const originId = formData.get('originId') as string | null;
    const destinationId = formData.get('destinationId') as string | null;
    const userId = formData.get('userId') as string | null;

    if (!relationshipType || !originId || !destinationId || !userId) {
      return { success: false, error: 'All fields are required' };
    }

    const relationship = await competencyRelationshipService.createRelationship(
      {
        relationshipType,
        originId,
        destinationId,
        userId,
      }
    );

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

export async function getCompetencyRelationshipAction(id: string) {
  try {
    const relationship =
      await competencyRelationshipService.getRelationshipById(id);
    return { success: true, relationship };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Relationship not found',
    };
  }
}

export async function getRelationshipsByOriginIdAction(originId: string) {
  try {
    const relationships =
      await competencyRelationshipService.getRelationshipsByOriginId(originId);
    return { success: true, relationships };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch relationships',
    };
  }
}

export async function getRelationshipsByDestinationIdAction(
  destinationId: string
) {
  try {
    const relationships =
      await competencyRelationshipService.getRelationshipsByDestinationId(
        destinationId
      );
    return { success: true, relationships };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch relationships',
    };
  }
}

export async function getAllCompetencyRelationshipsAction() {
  try {
    const relationships =
      await competencyRelationshipService.getAllRelationships();
    return { success: true, relationships };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch relationships',
    };
  }
}

export async function deleteCompetencyRelationshipAction(id: string) {
  try {
    await competencyRelationshipService.deleteRelationship(id);
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
