import api, { ApiResponse } from './api';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  phone: string;
  email?: string;
  role: string;
  status: string;
  created_at: string;
  avatar_url?: string;
}

export interface AuthResult {
  token: string;
  user: User;
  isNewUser?: boolean;
}

export interface OtpStatus {
  verified: boolean;
  phone_number?: string;
  attempts_remaining?: number;
}

// ──────────────────────────────────────────
//  Phone Auth
// ──────────────────────────────────────────

export async function sendOtp(phoneNumber: string): Promise<ApiResponse> {
  const { data } = await api.post('/auth/send-otp', { phoneNumber });
  return data;
}

export async function verifyOtp(phoneNumber: string, otp: string): Promise<ApiResponse<AuthResult>> {
  const { data } = await api.post('/auth/verify-otp', { phoneNumber, otp });
  return data;
}

export async function completeProfile(
  phone: string,
  name: string,
  email?: string,
): Promise<ApiResponse<AuthResult>> {
  const { data } = await api.post('/auth/complete-profile', { phone, name, email });
  return data;
}

export async function getOtpStatus(phoneNumber: string): Promise<ApiResponse<OtpStatus>> {
  const { data } = await api.get(`/auth/otp-status/${encodeURIComponent(phoneNumber)}`);
  return data;
}

// ──────────────────────────────────────────
//  Email Auth
// ──────────────────────────────────────────

export async function sendEmailOtp(email: string): Promise<ApiResponse> {
  const { data } = await api.post('/auth/send-email-otp', { email });
  return data;
}

export async function verifyEmailOtp(email: string, otp: string): Promise<ApiResponse<AuthResult>> {
  const { data } = await api.post('/auth/verify-email-otp', { email, otp });
  return data;
}

export async function completeProfileEmail(
  email: string,
  name: string,
  phone?: string,
): Promise<ApiResponse<AuthResult>> {
  const { data } = await api.post('/auth/complete-profile-email', { email, name, phone });
  return data;
}

// ──────────────────────────────────────────
//  User Profile
// ──────────────────────────────────────────

export async function getUserProfile(phone: string): Promise<ApiResponse<User>> {
  const { data } = await api.get('/users/profile', { params: { phone } });
  return data;
}

export async function registerUser(
  name: string,
  phone: string,
  email?: string,
): Promise<ApiResponse<User>> {
  const { data } = await api.post('/users/register', { name, phone, email });
  return data;
}

export async function updateProfile(
  updates: Partial<Pick<User, 'name' | 'email' | 'avatar_url'>>,
): Promise<ApiResponse<User>> {
  const { data } = await api.put('/users/profile', updates);
  return data;
}

const authService = {
  sendOtp,
  verifyOtp,
  completeProfile,
  getOtpStatus,
  sendEmailOtp,
  verifyEmailOtp,
  completeProfileEmail,
  getUserProfile,
  registerUser,
  updateProfile,
};

export default authService;
