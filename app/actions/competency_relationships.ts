'use server';

import { competencyRelationshipService } from '@/domain_core/services/competency_relationship';
import { RelationshipType } from '@/domain_core/model/domain_model';

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

/**
 * Returns all available RelationshipType enum values from Prisma schema.
 * This is a server action that can be called from client components.
 */
export async function getRelationshipTypesAction() {
  try {
    // Import RelationshipType enum from Prisma client
    const { RelationshipType } = await import('@prisma/client');

    // Get all enum values
    const types = Object.values(RelationshipType) as RelationshipType[];

    // Map enum values to display labels
    const typeLabels: Record<RelationshipType, string> = {
      ASSUMES: 'Assumes',
      EXTENDS: 'Extends',
      MATCHES: 'Matches',
      UNRELATED: 'Unrelated',
    };

    const typesWithLabels = types.map(type => ({
      value: type,
      label: typeLabels[type] || type,
    }));

    return { success: true, types: typesWithLabels };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch relationship types',
      types: [],
    };
  }
}
