import { apiClient } from './client';
import type {
  CompetencyResourceLink,
  CreateCompetencyResourceLinkRequest,
} from './types';

export const competencyResourceLinksApi = {
  create: async (
    data: CreateCompetencyResourceLinkRequest
  ): Promise<CompetencyResourceLink> => {
    const response = await apiClient.post<CompetencyResourceLink>(
      '/api/competency-resource-links',
      data
    );
    return response.data;
  },

  getById: async (id: string): Promise<CompetencyResourceLink> => {
    const response = await apiClient.get<CompetencyResourceLink>(
      `/api/competency-resource-links/${id}`
    );
    return response.data;
  },

  getAll: async (): Promise<CompetencyResourceLink[]> => {
    const response = await apiClient.get<CompetencyResourceLink[]>(
      '/api/competency-resource-links'
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/competency-resource-links/${id}`);
  },
};
