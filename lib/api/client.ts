import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('API request timed out');
      throw new Error('Request timed out. Please check if the server is running.');
    }
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - server may be down');
      throw new Error('Unable to connect to the server. Please ensure the backend is running.');
    }
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.statusText || 'Server error';
      console.error(`API error ${error.response.status}:`, message);
      throw new Error(message);
    }
    throw error;
  }
);
