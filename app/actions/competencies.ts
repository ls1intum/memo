'use server';

import { competencyService } from '@/lib/services/competency';

export async function createCompetencyAction(formData: FormData) {
  try {
    const title = formData.get('title');
    const description = formData.get('description') as string | undefined;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return { success: false, error: 'Title is required' };
    }

    const competency = await competencyService.createCompetency({
      title,
      description,
    });

    return { success: true, competency };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create competency',
    };
  }
}

export async function getCompetencyAction(id: string) {
  try {
    const competency = await competencyService.getCompetencyById(id);
    return { success: true, competency };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Competency not found',
    };
  }
}

export async function getAllCompetenciesAction() {
  try {
    const competencies = await competencyService.getAllCompetencies();
    return { success: true, competencies };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to fetch competencies',
    };
  }
}

export async function updateCompetencyAction(
  id: string,
  title?: string,
  description?: string
) {
  try {
    const competency = await competencyService.updateCompetency(id, {
      title,
      description,
    });
    return { success: true, competency };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to update competency',
    };
  }
}

export async function deleteCompetencyAction(id: string) {
  try {
    await competencyService.deleteCompetency(id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to delete competency',
    };
  }
}
