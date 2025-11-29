import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, Navigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import { resetPasswordSchema, ResetPasswordFormData } from '../lib/schemas';
import { useResetPassword } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import Loader from '../components/Loader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { mutate: resetPassword, isPending } = useResetPassword();

  useEffect(() => {
    document.title = 'Reset Password | Todo App';
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) return;
    resetPassword(
      { token, data },
      {
        onSuccess: () => {
          setShowLoader(true);
        },
      }
    );
  };

  if (isAuthenticated) return <Navigate to="/" replace />;
  if (showLoader) return <Loader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12">
      <Card variant="glass" className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-600/20 mb-4">
            <KeyRound className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-gray-400">Set a strong new password to secure your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="relative">
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              label="New Password"
              placeholder="Enter new password"
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

          <div className="relative">
            <Input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm New Password"
              placeholder="Confirm new password"
              error={errors.confirmPassword?.message}
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-[38px] text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <Button type="submit" disabled={isPending} className="w-full" size="lg">
            {isPending ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
