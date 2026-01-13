import axios from 'axios';
import { keycloak } from '../auth/keycloak';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    if (keycloak.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshed = await keycloak.updateToken(5);
        if (refreshed && keycloak.token) {
          originalRequest.headers.Authorization = `Bearer ${keycloak.token}`;
          return apiClient.request(originalRequest);
        }
      } catch (refreshError) {
        keycloak.login();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
