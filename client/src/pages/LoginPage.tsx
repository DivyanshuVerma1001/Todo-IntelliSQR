import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { loginSchema, LoginFormData } from '../lib/schemas';
import { useLogin } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import GoogleLoginWrapper from '../components/GoogleLoginWrapper';

const LoginPage = () => {
  useEffect(() => {
    document.title = 'Login | Auth App';
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF8E1] via-[#FFF3E0] to-[#E8F5E9] px-4 transition-all duration-700">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Welcome Back 👋</h2>
        <p className="text-gray-600 text-center mb-6">Log in to your account</p>

        <div className="mb-4">
          <GoogleLoginWrapper />
        </div>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-3 text-sm text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-orange-500">
            <Mail className="text-gray-500 mr-2" size={18} />
            <input
              {...register('email')}
              placeholder="Enter your email"
              className="w-full bg-transparent outline-none"
            />
          </div>
          {errors.email && (
            <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>
          )}
        </div>

        <div className="mb-2">
          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <div className="relative flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-orange-500">
            <Lock className="text-gray-500 mr-2" size={18} />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="w-full bg-transparent outline-none pr-8"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>
          )}
        </div>

        <div className="text-right mb-4">
          <Link to="/forgotPassword" className="text-sm text-orange-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={`w-full py-3 rounded-lg font-semibold text-white shadow-md transition duration-200 ${
            isPending
              ? 'bg-orange-400 cursor-not-allowed'
              : 'bg-orange-600 hover:bg-orange-700'
          }`}
        >
          {isPending ? 'Logging in...' : 'Log In'}
        </button>

        <div className="mt-6 text-center text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-orange-600 hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;

