import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { signupSchema, SignupFormData } from '../lib/schemas';
import { useRegister } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import GoogleRegisterWrapper from '../components/GoogleRegisterWrapper';

const SignupPage = () => {
  useEffect(() => {
    document.title = 'Signup | Auth App';
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
    <div className="flex py-5 h-screen items-center justify-center bg-gradient-to-br from-orange-200 via-orange-100 to-red-100 px-2">
      <div className="flex w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
        <div className="hidden md:flex w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <h2 className="text-2xl font-bold drop-shadow-lg">Fresh Meals, Fast Delivery 🍴</h2>
            <p className="mt-1 text-xs opacity-90">Order your favorites & track them in real time!</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
          <h2 className="text-2xl font-extrabold text-gray-800 mb-1">Create Account</h2>
          <p className="text-xs text-gray-500 mb-6">Sign up and enjoy quick, delicious meals 🚀</p>

          <div className="mb-4">
            <GoogleRegisterWrapper />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Name</label>
              <input
                {...registerForm('name')}
                placeholder="Enter your name"
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-1 focus:ring-orange-400 focus:outline-none transition-all duration-200 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Email</label>
              <input
                {...registerForm('email')}
                type="email"
                placeholder="example@email.com"
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-1 focus:ring-orange-400 focus:outline-none transition-all duration-200 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Phone</label>
              <div className="flex">
                <span className="px-3 py-2 border rounded-l-lg bg-gray-100 text-gray-600 text-xs">
                  +91
                </span>
                <input
                  {...registerForm('phone')}
                  placeholder="9876543210"
                  className="flex-1 px-3 py-2 border-t border-b border-r rounded-r-lg focus:ring-1 focus:ring-orange-400 focus:outline-none transition-all duration-200 text-sm"
                />
              </div>
              {errors.phone && (
                <span className="text-red-500 text-xs mt-1 block">{errors.phone.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Password</label>
              <div className="relative">
                <input
                  {...registerForm('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-1 focus:ring-orange-400 focus:outline-none transition-all duration-200 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs mt-1 block">{errors.password.message}</span>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold mb-1">Verification Method</p>
              <div className="flex gap-4">
                <label className="flex items-center gap-1 cursor-pointer text-xs">
                  <input
                    type="radio"
                    value="email"
                    {...registerForm('verificationMethod')}
                    className="accent-orange-500"
                  />
                  <span>Email</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer text-xs">
                  <input
                    type="radio"
                    value="phone"
                    {...registerForm('verificationMethod')}
                    className="accent-orange-500"
                  />
                  <span>Phone</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`w-full py-2 rounded-lg text-white font-semibold text-sm bg-gradient-to-r from-orange-500 to-red-500 shadow hover:shadow-md hover:scale-[1.02] transition-transform duration-200 ${
                isPending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isPending ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-xs mt-4">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-orange-600 font-semibold hover:underline hover:text-red-500 transition"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

