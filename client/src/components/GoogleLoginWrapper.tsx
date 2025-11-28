import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLogin from './GoogleLogin';

const GoogleLoginWrapper = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginWrapper;

