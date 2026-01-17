import { apiClient } from './client';
import type {
  Competency,
  CreateCompetencyRequest,
  UpdateCompetencyRequest,
} from './types';

export const competenciesApi = {
  create: async (data: CreateCompetencyRequest): Promise<Competency> => {
    const response = await apiClient.post<Competency>(
      '/api/competencies',
      data
    );
    return response.data;
  },

  getById: async (id: string): Promise<Competency> => {
    const response = await apiClient.get<Competency>(`/api/competencies/${id}`);
    return response.data;
  },

  getAll: async (): Promise<Competency[]> => {
    const response = await apiClient.get<Competency[]>('/api/competencies');
    return response.data;
  },

  getRandom: async (count: number = 2): Promise<Competency[]> => {
    const response = await apiClient.get<Competency[]>(
      '/api/competencies/random',
      {
        params: { count },
      }
    );
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateCompetencyRequest
  ): Promise<Competency> => {
    const response = await apiClient.put<Competency>(
      `/api/competencies/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/competencies/${id}`);
  },
};
