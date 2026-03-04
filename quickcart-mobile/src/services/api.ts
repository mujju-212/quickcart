import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL } from '@utils/constants';
import { Storage } from '@utils/storage';
import { STORAGE_KEYS } from '@utils/constants';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ──────────────────────────────────────────
//  Axios Instance
// ──────────────────────────────────────────

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ──────────────────────────────────────────
//  Request Interceptor — attach JWT
// ──────────────────────────────────────────

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Storage.getString(STORAGE_KEYS.AUTH_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ──────────────────────────────────────────
//  Response Interceptor — normalize errors
// ──────────────────────────────────────────

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiResponse>) => {
    if (error.response) {
      const { status, data } = error.response;

      // Unauthorized — clear token & redirect (handled by auth store listener)
      if (status === 401) {
        Storage.delete(STORAGE_KEYS.AUTH_TOKEN);
        Storage.delete(STORAGE_KEYS.USER_DATA);
      }

      // Rate limited
      if (status === 429) {
        const msg = data?.message || 'Too many requests. Please try again later.';
        return Promise.reject(new Error(msg));
      }

      // Server error
      if (status >= 500) {
        return Promise.reject(new Error('Something went wrong. Please try again.'));
      }

      // Normal API error
      const message = data?.message || data?.error || 'Request failed';
      return Promise.reject(new Error(message));
    }

    // Network error
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Check your connection.'));
    }

    return Promise.reject(new Error('No internet connection.'));
  },
);

export default api;
