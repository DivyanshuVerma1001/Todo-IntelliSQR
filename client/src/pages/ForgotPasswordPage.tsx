import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../lib/schemas';
import { useForgotPassword } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPasswordPage = () => {
  useEffect(() => {
    document.title = 'Forgot Password | Todo App';
  }, []);

  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 px-4 py-12">
      <Card variant="glass" className="w-full max-w-md p-8 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 mb-4">
            <Mail className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Forgot Password?</h2>
          <p className="text-gray-400">
            Don't worry! Enter your email and we'll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            {...register('email')}
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            error={errors.email?.message}
            disabled={isPending}
          />

          <Button type="submit" disabled={isPending} className="w-full" size="lg">
            {isPending ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
