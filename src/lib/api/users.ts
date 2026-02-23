import { apiClient } from './client';
import type { User, CreateUserRequest, UpdateUserRequest } from './types';

export const usersApi = {
  create: async (data: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post<User>('/api/users', data);
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/api/users/${id}`);
    return response.data;
  },

  getByEmail: async (email: string): Promise<User | null> => {
    try {
      const response = await apiClient.get<User>('/api/users/by-email', {
        params: { email },
      });
      return response.data;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        (error as { response?: { status?: number } }).response?.status === 404
      ) {
        return null;
      }
      throw error;
    }
  },

  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/api/users');
    return response.data;
  },

  update: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put<User>(`/api/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/users/${id}`);
  },
};
