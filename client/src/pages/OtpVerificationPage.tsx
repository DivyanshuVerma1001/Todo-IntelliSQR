import { useState, useEffect } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useOtpVerification } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';

const OtpVerificationPage = () => {
  const { email, phone } = useParams<{ email: string; phone: string }>();
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { mutate: verifyOtp, isPending } = useOtpVerification();

  useEffect(() => {
    document.title = 'OTP Verification | Auth App';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-3">OTP Verification</h1>
        <p className="text-center text-gray-600 mb-6">
          Enter the 5-digit OTP sent to your registered{' '}
          <span className="font-semibold text-gray-800">{email || phone}</span>
        </p>

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
                className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isPending || otp.join('').length !== 5}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Didn't receive the code?{' '}
          <button
            type="button"
            onClick={() => {
              // Resend OTP functionality can be added here
              alert('Resend OTP feature coming soon!');
            }}
            className="text-orange-500 font-semibold hover:underline"
          >
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  );
};

export default OtpVerificationPage;

