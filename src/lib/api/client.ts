import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      throw new Error(
        'Request timed out. Please check if the server is running.'
      );
    }
    if (error.code === 'ERR_NETWORK') {
      throw new Error(
        'Unable to connect to the server. Please ensure the backend is running.'
      );
    }
    if (error.response) {
      const message =
        error.response.data?.message ||
        error.response.statusText ||
        'Server error';
      throw new Error(message);
    }
    throw error;
  }
);
