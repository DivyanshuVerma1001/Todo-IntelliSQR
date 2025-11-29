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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12">
      <Card variant="glass" className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-600/20 mb-4">
            <UserPlus className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400">Sign up to start managing your todos</p>
        </div>

        <div className="mb-6">
          <GoogleRegisterWrapper />
        </div>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="px-4 text-sm text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
            <div className="flex">
              <span className="px-4 py-3 bg-gray-800/60 border border-r-0 border-gray-700/50 rounded-l-2xl text-gray-400 flex items-center">
                +91
              </span>
              <input
                {...registerForm('phone')}
                placeholder="9876543210"
                className="flex-1 px-4 py-3 bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-r-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                disabled={isPending}
              />
            </div>
            {errors.phone && <p className="mt-1.5 text-sm text-red-400">{errors.phone.message}</p>}
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
              className="absolute right-4 top-[38px] text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Verification Method
            </label>
            <div className="flex gap-4">
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  value="email"
                  {...registerForm('verificationMethod')}
                  className="sr-only peer"
                />
                <div className="p-4 rounded-2xl border-2 border-gray-700 peer-checked:border-blue-600 peer-checked:bg-blue-600/10 transition-all hover:border-gray-600">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400 peer-checked:text-blue-500" />
                    <span className="text-white font-medium">Email</span>
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
                <div className="p-4 rounded-2xl border-2 border-gray-700 peer-checked:border-blue-600 peer-checked:bg-blue-600/10 transition-all hover:border-gray-600">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400 peer-checked:text-blue-500" />
                    <span className="text-white font-medium">Phone</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <Button type="submit" disabled={isPending} className="w-full" size="lg">
            {isPending ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
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
