import { useState, useEffect } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useOtpVerification } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const OtpVerificationPage = () => {
  const { email, phone } = useParams<{ email: string; phone: string }>();
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const { isAuthenticated } = useAuthStore();
  const { mutate: verifyOtp, isPending } = useOtpVerification();

  useEffect(() => {
    document.title = 'OTP Verification | Todo App';
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleOtpVerification = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 5) {
      return;
    }

    verifyOtp({
      email: email || undefined,
      phone: phone || undefined,
      otp: enteredOtp,
    });
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12">
      <Card variant="glass" className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-600/20 mb-4">
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">OTP Verification</h1>
          <p className="text-gray-400">
            Enter the 5-digit code sent to{' '}
            <span className="font-semibold text-white">{email || phone}</span>
          </p>
        </div>

        <form onSubmit={handleOtpVerification} className="space-y-6">
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-14 h-14 text-center text-2xl font-bold bg-gray-800/60 border border-gray-700/50 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            ))}
          </div>

          <Button
            type="submit"
            disabled={isPending || otp.join('').length !== 5}
            className="w-full"
            size="lg"
          >
            {isPending ? 'Verifying...' : 'Verify OTP'}
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

export default OtpVerificationPage;
