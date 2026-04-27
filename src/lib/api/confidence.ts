import { apiClient } from './client';
import type { ConfidenceRating } from './types';

export const confidenceApi = {
  getAll: async (): Promise<ConfidenceRating[]> => {
    const response = await apiClient.get<ConfidenceRating[]>(
      '/api/admin/confidence'
    );
    return response.data;
  },

  getForCompetency: async (id: string): Promise<ConfidenceRating> => {
    const response = await apiClient.get<ConfidenceRating>(
      `/api/admin/confidence/${id}`
    );
    return response.data;
  },

  recomputeAll: async (): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post<{ status: string; message: string }>(
      '/api/admin/confidence/recompute'
    );
    return response.data;
  },

  recomputeOne: async (id: string): Promise<ConfidenceRating> => {
    const response = await apiClient.post<ConfidenceRating>(
      `/api/admin/confidence/recompute/${id}`
    );
    return response.data;
  },
};
