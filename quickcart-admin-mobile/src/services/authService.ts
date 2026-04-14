// QuickCart Admin — Auth Service

import api from './api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    phone: string;
    email: string;
    role: string;
  };
  message: string;
}

const authService = {
  /**
   * Admin login with username/password
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/admin/login', credentials);
    return response.data;
  },

  /**
   * Verify token is still valid
   */
  verifyToken: async (): Promise<{ valid: boolean; user?: LoginResponse['user'] }> => {
    try {
      const response = await api.get('/auth/verify');
      return { valid: true, user: response.data.user };
    } catch {
      return { valid: false };
    }
  },
};

export default authService;
