import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleRegister from './GoogleRegister';

const GoogleRegisterWrapper = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  // Debug: Log client ID (remove in production if needed)
  if (typeof window !== 'undefined') {
    console.log('Google Client ID configured:', clientId ? 'Yes' : 'No');
  }

  if (!clientId || clientId.trim() === '') {
    console.error('Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.');
    return (
      <div className="w-full p-3 bg-yellow-600/10 border border-yellow-600/20 rounded-xl text-center">
        <p className="text-xs text-yellow-400">Google signup is not configured</p>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId.trim()}>
      <GoogleRegister />
    </GoogleOAuthProvider>
  );
};

export default GoogleRegisterWrapper;

