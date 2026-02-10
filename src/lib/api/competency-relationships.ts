import { apiClient } from './client';
import type { CompetencyRelationship } from './types';

export const competencyRelationshipsApi = {
  getById: async (id: string): Promise<CompetencyRelationship> => {
    const response = await apiClient.get<CompetencyRelationship>(
      `/api/competency-relationships/${id}`
    );
    return response.data;
  },

  getAll: async (): Promise<CompetencyRelationship[]> => {
    const response = await apiClient.get<CompetencyRelationship[]>(
      '/api/competency-relationships'
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/competency-relationships/${id}`);
  },
};
