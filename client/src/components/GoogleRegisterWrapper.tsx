import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleRegister from './GoogleRegister';

const GoogleRegisterWrapper = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleRegister />
    </GoogleOAuthProvider>
  );
};

export default GoogleRegisterWrapper;

