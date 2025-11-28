import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { User } from '../model/user';
import { oauth2client } from '../utils/googleConfig';

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.query as { code: string };
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );

    const { email, name } = userRes.data;
    const userData = await User.findOne({ email });

    if (!userData) {
      throw new Error('Email does not exist');
    }

    const token = jwt.sign(
      { _id: userData._id, emailId: userData.email },
      process.env.JWT_KEY || '',
      { expiresIn: 3600 }
    );

    res.cookie('token', token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    const reply = {
      name: userData.name,
      email: userData.email,
      _id: userData._id.toString(),
    };

    res.status(201).json({
      user: reply,
      message: 'Login successfully',
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const googleRegister = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.query as { code: string };
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );

    const { email, name } = userRes.data;
    let userData = await User.findOne({ email });

    if (userData) {
      throw new Error('User already exists!');
    }

    userData = await User.create({
      name: name,
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
      secure: true,
      sameSite: 'none',
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
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

