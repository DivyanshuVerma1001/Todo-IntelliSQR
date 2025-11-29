import { google } from 'googleapis';

// For @react-oauth/google with auth-code flow, redirect URI should be 'postmessage'
// This is the default redirect URI used by the library
const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'postmessage';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

// Log configuration status (without exposing secrets)
if (!clientId || !clientSecret) {
  console.warn('Google OAuth configuration incomplete:', {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    redirectUri,
  });
}

export const oauth2client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);

