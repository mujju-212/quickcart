// QuickCart Admin — Axios API Instance

import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { storage, STORAGE_KEYS } from '../utils/storage';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — inject admin JWT token
api.interceptors.request.use(
  (config) => {
    const token = storage.getString(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stored token
      storage.delete(STORAGE_KEYS.AUTH_TOKEN);
      storage.delete(STORAGE_KEYS.ADMIN_USERNAME);
      // Navigation to login is handled by auth store listener
    }

    // Extract error message
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';

    return Promise.reject({ ...error, message });
  }
);

export default api;
