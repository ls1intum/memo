import axios from 'axios';
import { apiClient } from './client';
import type {
  LearningResource,
  CreateLearningResourceRequest,
  UpdateLearningResourceRequest,
} from './types';

export const learningResourcesApi = {
  create: async (
    data: CreateLearningResourceRequest
  ): Promise<LearningResource> => {
    const response = await apiClient.post<LearningResource>(
      '/api/learning-resources',
      data
    );
    return response.data;
  },

  getById: async (id: string): Promise<LearningResource> => {
    const response = await apiClient.get<LearningResource>(
      `/api/learning-resources/${id}`
    );
    return response.data;
  },

  getByUrl: async (url: string): Promise<LearningResource | null> => {
    try {
      const response = await apiClient.get<LearningResource>(
        '/api/learning-resources/by-url',
        {
          params: { url },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  getAll: async (): Promise<LearningResource[]> => {
    const response = await apiClient.get<LearningResource[]>(
      '/api/learning-resources'
    );
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateLearningResourceRequest
  ): Promise<LearningResource> => {
    const response = await apiClient.put<LearningResource>(
      `/api/learning-resources/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/learning-resources/${id}`);
  },
};
