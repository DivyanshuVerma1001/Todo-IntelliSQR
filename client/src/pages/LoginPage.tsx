import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { loginSchema, LoginFormData } from '../lib/schemas';
import { useLogin } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import GoogleLoginWrapper from '../components/GoogleLoginWrapper';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const LoginPage = () => {
  useEffect(() => {
    document.title = 'Login | Todo App';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 px-4 py-12">
      <Card variant="glass" className="w-full max-w-md p-8 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 mb-4">
            <LogIn className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Log in to your account to continue</p>
        </div>

        <div className="mb-6">
          <GoogleLoginWrapper />
        </div>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="px-4 text-sm text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            {...register('email')}
            type="email"
            label="Email"
            placeholder="Enter your email"
            error={errors.email?.message}
            disabled={isPending}
          />

          <div className="relative">
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Enter your password"
              error={errors.password?.message}
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[38px] text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="text-right">
            <Link
              to="/forgotPassword"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" disabled={isPending} className="w-full" size="lg">
            {isPending ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-400">Don't have an account? </span>
          <Link
            to="/signup"
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
