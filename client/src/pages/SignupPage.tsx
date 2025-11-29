import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Mail, Phone } from 'lucide-react';
import { signupSchema, SignupFormData } from '../lib/schemas';
import { useRegister } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import GoogleRegisterWrapper from '../components/GoogleRegisterWrapper';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const SignupPage = () => {
  useEffect(() => {
    document.title = 'Signup | Todo App';
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { mutate: register, isPending } = useRegister();

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      verificationMethod: 'email',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data: SignupFormData) => {
    register(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-4">
      <Card variant="glass" className="w-full max-w-xl p-5">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-600/20 mb-2">
            <UserPlus className="w-6 h-6 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
          <p className="text-sm text-gray-400">Sign up to start managing your todos</p>
        </div>

        <div className="mb-3">
          <GoogleRegisterWrapper />
        </div>

        <div className="flex items-center my-3">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="px-3 text-xs text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input
            {...registerForm('name')}
            label="Full Name"
            placeholder="Enter your name"
            error={errors.name?.message}
            disabled={isPending}
          />

          <Input
            {...registerForm('email')}
            type="email"
            label="Email"
            placeholder="example@email.com"
            error={errors.email?.message}
            disabled={isPending}
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone</label>
            <div className="flex">
              <span className="px-3 py-2 bg-gray-800/60 border border-r-0 border-gray-700/50 rounded-l-2xl text-gray-400 flex items-center text-sm">
                +91
              </span>
              <input
                {...registerForm('phone')}
                placeholder="9876543210"
                className="flex-1 px-3 py-2 bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-r-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                disabled={isPending}
              />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
          </div>

          <div className="relative">
            <Input
              {...registerForm('password')}
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="••••••••"
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

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Verification Method
            </label>
            <div className="flex gap-3">
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  value="email"
                  {...registerForm('verificationMethod')}
                  className="sr-only peer"
                />
                <div className="p-3 rounded-xl border-2 border-gray-700 peer-checked:border-blue-600 peer-checked:bg-blue-600/10 transition-all hover:border-gray-600">
                  <div className="flex items-center gap-2 justify-center">
                    <Mail className="w-4 h-4 text-gray-400 peer-checked:text-blue-500" />
                    <span className="text-white font-medium text-sm">Email</span>
                  </div>
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  value="phone"
                  {...registerForm('verificationMethod')}
                  className="sr-only peer"
                />
                <div className="p-3 rounded-xl border-2 border-gray-700 peer-checked:border-blue-600 peer-checked:bg-blue-600/10 transition-all hover:border-gray-600">
                  <div className="flex items-center gap-2 justify-center">
                    <Phone className="w-4 h-4 text-gray-400 peer-checked:text-blue-500" />
                    <span className="text-white font-medium text-sm">Phone</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <Button type="submit" disabled={isPending} className="w-full" size="md">
            {isPending ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-4 text-center text-xs">
          <span className="text-gray-400">Already have an account? </span>
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Log in
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SignupPage;
