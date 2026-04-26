import axios from 'axios';
import { keycloak } from '../auth/keycloak';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(async config => {
  if (keycloak.authenticated) {
    await keycloak.updateToken(30).catch(() => {
      keycloak.logout();
    });
    if (keycloak.token) {
      config.headers.set('Authorization', `Bearer ${keycloak.token}`);
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      error.message =
        'Request timed out. Please check if the server is running.';
    } else if (error.code === 'ERR_NETWORK') {
      error.message =
        'Unable to connect to the server. Please ensure the backend is running.';
    } else if (error.response) {
      error.message =
        error.response.data?.message ||
        error.response.statusText ||
        'Server error';
    }
    throw error;
  }
);
