import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-4">
      <Card variant="glass" className="w-full max-w-md p-5">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-600/20 mb-2">
            <LogIn className="w-6 h-6 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
          <p className="text-sm text-gray-400">Log in to your account</p>
        </div>

        <div className="mb-3">
          <GoogleLoginWrapper />
        </div>

        <div className="flex items-center my-3">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="px-3 text-xs text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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
              className="absolute right-3 top-[calc(1.25rem+0.375rem+1.125rem)] -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none flex items-center justify-center"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="text-right">
            <Link
              to="/forgotPassword"
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" disabled={isPending} className="w-full" size="md">
            {isPending ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <div className="mt-4 text-center text-xs">
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
