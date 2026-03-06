import { useState, useCallback, useRef } from 'react';
import { useAuthStore } from '@stores/authStore';
import authService, { User, AuthResult } from '@services/authService';
import { haptics } from '@utils/haptics';

type AuthMethod = 'phone' | 'email';

interface UseAuthReturn {
  // State
  isLoading: boolean;
  error: string | null;

  // Phone flow
  sendOtp: (identifier: string, method?: AuthMethod) => Promise<boolean>;
  verifyOtp: (identifier: string, otp: string, method?: AuthMethod) => Promise<AuthResult | null>;
  completeProfile: (name: string, identifier: string, method?: AuthMethod, secondary?: string) => Promise<boolean>;

  // Session
  logout: () => void;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((s) => s.login);
  const logoutStore = useAuthStore((s) => s.logout);

  const clearError = useCallback(() => setError(null), []);

  // Send OTP
  const sendOtp = useCallback(async (identifier: string, method: AuthMethod = 'phone'): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      if (method === 'email') {
        await authService.sendEmailOtp(identifier);
      } else {
        await authService.sendOtp(identifier);
      }
      haptics.success();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      haptics.error();
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verify OTP
  const verifyOtp = useCallback(
    async (identifier: string, otp: string, method: AuthMethod = 'phone'): Promise<AuthResult | null> => {
      setIsLoading(true);
      setError(null);
      try {
        let result: any;
        if (method === 'email') {
          result = await authService.verifyEmailOtp(identifier, otp);
        } else {
          result = await authService.verifyOtp(identifier, otp);
        }

        // If user exists → auto-login
        if (result.token && result.user) {
          login(result.user, result.token);
          haptics.success();
          return result as AuthResult;
        }

        // If new user → need profile completion
        haptics.tap();
        return result;
      } catch (err: any) {
        setError(err.message || 'Invalid OTP');
        haptics.error();
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [login],
  );

  // Complete profile for new users
  const completeProfileFn = useCallback(
    async (name: string, identifier: string, method: AuthMethod = 'phone', secondary?: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        let result: any;
        if (method === 'email') {
          result = await authService.completeProfileEmail(identifier, name, secondary);
        } else {
          result = await authService.completeProfile(identifier, name, secondary);
        }

        if (result.token && result.user) {
          login(result.user, result.token);
          haptics.success();
          return true;
        }

        setError('Profile creation failed');
        return false;
      } catch (err: any) {
        setError(err.message || 'Failed to create profile');
        haptics.error();
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [login],
  );

  // Logout
  const logout = useCallback(() => {
    logoutStore();
    haptics.tap();
  }, [logoutStore]);

  return {
    isLoading,
    error,
    sendOtp,
    verifyOtp,
    completeProfile: completeProfileFn,
    logout,
    clearError,
  };
}

export default useAuth;
