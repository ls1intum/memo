'use server';

import { competencyResourceLinkService } from '@/domain_core/services/competency_resource_link';

export async function createCompetencyResourceLinkAction(formData: FormData) {
  try {
    const competencyId = formData.get('competencyId') as string | null;
    const resourceId = formData.get('resourceId') as string | null;
    const userId = formData.get('userId') as string | null;

    if (!competencyId || !resourceId || !userId) {
      return { success: false, error: 'All fields are required' };
    }

    const link = await competencyResourceLinkService.createLink({
      competencyId,
      resourceId,
      userId,
    });

    return { success: true, link };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create link',
    };
  }
}

export async function getCompetencyResourceLinkAction(id: string) {
  try {
    const link = await competencyResourceLinkService.getLinkById(id);
    return { success: true, link };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Link not found',
    };
  }
}

export async function getLinksByCompetencyIdAction(competencyId: string) {
  try {
    const links =
      await competencyResourceLinkService.getLinksByCompetencyId(competencyId);
    return { success: true, links };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch links',
    };
  }
}

export async function getLinksByResourceIdAction(resourceId: string) {
  try {
    const links =
      await competencyResourceLinkService.getLinksByResourceId(resourceId);
    return { success: true, links };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch links',
    };
  }
}

export async function getAllCompetencyResourceLinksAction() {
  try {
    const links = await competencyResourceLinkService.getAllLinks();
    return { success: true, links };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch links',
    };
  }
}

export async function deleteCompetencyResourceLinkAction(id: string) {
  try {
    await competencyResourceLinkService.deleteLink(id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete link',
    };
  }
}
