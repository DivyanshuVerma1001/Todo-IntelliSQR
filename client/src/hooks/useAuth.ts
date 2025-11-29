import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiClient } from '../lib/apiClient';
import { useAuthStore } from '../store/authStore';
import { AuthResponse } from '../types/auth';
import {
  LoginFormData,
  SignupFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  OtpVerificationFormData,
} from '../lib/schemas';

// Check authentication status
export const useCheckAuth = () => {
  const { setUser, setAuthenticated, setLoading } = useAuthStore();

  return useQuery({
    queryKey: ['auth', 'check'],
    queryFn: async () => {
      try {
        const response = await apiClient.get<AuthResponse>('/user/check');
        if (response.data.user) {
          setUser(response.data.user);
          setAuthenticated(true);
        }
        return response.data;
      } catch (error) {
        setUser(null);
        setAuthenticated(false);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};

// Register mutation
export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: SignupFormData) => {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        '/user/register',
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success('Registration successful! Please verify your OTP.');
      navigate(`/otpverification/${variables.email}/${variables.phone}`);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
    },
  });
};

// OTP Verification mutation
export const useOtpVerification = () => {
  const { setUser, setAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: OtpVerificationFormData) => {
      const response = await apiClient.post<AuthResponse>('/user/otpverification', data);
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      setAuthenticated(true);
      queryClient.setQueryData(['auth', 'check'], data);
      toast.success('OTP verified successfully!');
      navigate('/');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || error.response?.data?.message || 'OTP verification failed';
      toast.error(errorMessage);
    },
  });
};

// Login mutation
export const useLogin = () => {
  const { setUser, setAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await apiClient.post<AuthResponse>('/user/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      setAuthenticated(true);
      queryClient.setQueryData(['auth', 'check'], data);
      toast.success('Login successful!');
      navigate('/');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
    },
  });
};

// Google Login mutation
export const useGoogleLogin = () => {
  const { setUser, setAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      const response = await apiClient.get<AuthResponse>(`/user/googleLogin?code=${code}`);
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      setAuthenticated(true);
      queryClient.setQueryData(['auth', 'check'], data);
      toast.success('Google login successful!');
      navigate('/');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || error.response?.data?.message || 'Google login failed';
      toast.error(errorMessage);
    },
  });
};

// Google Register mutation
export const useGoogleRegister = () => {
  const { setUser, setAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      const response = await apiClient.get<AuthResponse>(`/user/googleRegister?code=${code}`);
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      setAuthenticated(true);
      queryClient.setQueryData(['auth', 'check'], data);
      toast.success('Google registration successful!');
      navigate('/');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || error.response?.data?.message || 'Google registration failed';
      toast.error(errorMessage);
    },
  });
};

// Forgot Password mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordFormData) => {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        '/user/forgotPassword',
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Reset link sent to your email!');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || error.response?.data?.message || 'Failed to send reset link';
      toast.error(errorMessage);
    },
  });
};

// Reset Password mutation
export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ token, data }: { token: string; data: ResetPasswordFormData }) => {
      const response = await apiClient.post<{ message: string }>(
        `/user/resetPassword/${token}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || error.response?.data?.message || 'Failed to reset password';
      toast.error(errorMessage);
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/user/logout');
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast.success('Logged out successfully');
      navigate('/login');
    },
    onError: () => {
      logout();
      queryClient.clear();
      navigate('/login');
    },
  });
};

