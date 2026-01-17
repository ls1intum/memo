'use server';

import { learningResourceService } from '@/domain_core/services/learning_resource';

export async function createLearningResourceAction(formData: FormData) {
  try {
    const title = formData.get('title');
    const url = formData.get('url');

    if (
      !title ||
      !url ||
      typeof title !== 'string' ||
      typeof url !== 'string'
    ) {
      return {
        success: false,
        error: 'Title and URL are required',
      };
    }

    const resource = await learningResourceService.createLearningResource({
      title,
      url,
    });

    return { success: true, resource };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create learning resource',
    };
  }
}

export async function getLearningResourceAction(id: string) {
  try {
    const resource = await learningResourceService.getLearningResourceById(id);
    return { success: true, resource };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Learning resource not found',
    };
  }
}

export async function getAllLearningResourcesAction() {
  try {
    const resources = await learningResourceService.getAllLearningResources();
    return { success: true, resources };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch learning resources',
    };
  }
}

export async function updateLearningResourceAction(
  id: string,
  title?: string,
  url?: string
) {
  try {
    const resource = await learningResourceService.updateLearningResource(id, {
      title,
      url,
    });
    return { success: true, resource };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update learning resource',
    };
  }
}

export async function deleteLearningResourceAction(id: string) {
  try {
    await learningResourceService.deleteLearningResource(id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to delete learning resource',
    };
  }
}

export async function getRandomLearningResourceAction() {
  try {
    const resource = await learningResourceService.getRandomLearningResource();
    return { success: true, resource };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch random learning resource',
    };
  }
}
