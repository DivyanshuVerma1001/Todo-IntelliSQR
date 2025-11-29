import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { google } from 'googleapis';
import { User } from '../model/user.js';

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.query as { code: string };
    
    if (!code) {
      res.status(400).json({
        message: 'Authorization code is required',
        error: 'Missing code parameter',
      });
      return;
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'postmessage';

    if (!clientId || !clientSecret) {
      console.error('Google OAuth config missing:', {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
        redirectUri,
      });
      res.status(500).json({
        message: 'Google OAuth configuration is missing',
        error: 'Server configuration error',
      });
      return;
    }

    // Create OAuth2Client instance with client ID to ensure it's included in the request
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );
    
    const googleRes = await oauth2Client.getToken({
      code,
      redirect_uri: redirectUri,
    });
    oauth2Client.setCredentials(googleRes.tokens);

    if (!googleRes.tokens.access_token) {
      res.status(400).json({
        message: 'Failed to get access token from Google',
        error: 'Invalid authorization code',
      });
      return;
    }

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${googleRes.tokens.access_token}`,
        },
      }
    );

    const { email, name } = userRes.data;
    
    if (!email) {
      res.status(400).json({
        message: 'Failed to get user email from Google',
        error: 'Email not provided by Google',
      });
      return;
    }

    const userData = await User.findOne({ email });

    if (!userData) {
      res.status(404).json({
        message: 'Account not found. Please sign up first.',
        error: 'Email does not exist',
      });
      return;
    }

    const token = jwt.sign(
      { _id: userData._id, emailId: userData.email },
      process.env.JWT_KEY || '',
      { expiresIn: 3600 }
    );

    res.cookie('token', token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    const reply = {
      name: userData.name,
      email: userData.email,
      _id: userData._id.toString(),
    };

    res.status(200).json({
      user: reply,
      message: 'Login successfully',
    });
  } catch (err: any) {
    console.error('Google login error:', err);
    const error = err as Error;
    
    if (err.response?.data) {
      res.status(400).json({
        message: 'Google authentication failed',
        error: err.response.data.error_description || error.message,
      });
      return;
    }

    res.status(500).json({
      message: 'Internal server error',
      error: error.message || 'Unknown error occurred',
    });
  }
};

export const googleRegister = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.query as { code: string };
    
    if (!code) {
      res.status(400).json({
        message: 'Authorization code is required',
        error: 'Missing code parameter',
      });
      return;
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'postmessage';

    if (!clientId || !clientSecret) {
      console.error('Google OAuth config missing:', {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
        redirectUri,
      });
      res.status(500).json({
        message: 'Google OAuth configuration is missing',
        error: 'Server configuration error',
      });
      return;
    }

    // Create OAuth2Client instance with client ID to ensure it's included in the request
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );
    
    const googleRes = await oauth2Client.getToken({
      code,
      redirect_uri: redirectUri,
    });
    oauth2Client.setCredentials(googleRes.tokens);

    if (!googleRes.tokens.access_token) {
      res.status(400).json({
        message: 'Failed to get access token from Google',
        error: 'Invalid authorization code',
      });
      return;
    }

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${googleRes.tokens.access_token}`,
        },
      }
    );

    const { email, name } = userRes.data;
    
    if (!email) {
      res.status(400).json({
        message: 'Failed to get user email from Google',
        error: 'Email not provided by Google',
      });
      return;
    }

    let userData = await User.findOne({ email });

    if (userData) {
      res.status(409).json({
        message: 'Account already exists. Please login instead.',
        error: 'User already exists',
      });
      return;
    }

    userData = await User.create({
      name: name || 'User',
      email: email,
      accountVerified: true,
    });

    const token = jwt.sign(
      { _id: userData._id, emailId: userData.email },
      process.env.JWT_KEY || '',
      { expiresIn: 3600 }
    );

    res.cookie('token', token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    const reply = {
      name: userData.name,
      email: userData.email,
      _id: userData._id.toString(),
    };

    res.status(201).json({
      user: reply,
      message: 'Registered successfully',
    });
  } catch (err: any) {
    console.error('Google register error:', err);
    const error = err as Error;
    
    if (err.response?.data) {
      res.status(400).json({
        message: 'Google authentication failed',
        error: err.response.data.error_description || error.message,
      });
      return;
    }

    res.status(500).json({
      message: 'Internal server error',
      error: error.message || 'Unknown error occurred',
    });
  }
};

