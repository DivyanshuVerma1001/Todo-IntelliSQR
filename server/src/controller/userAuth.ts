import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User, IUser } from '../model/user';
import { generateVerificationCode } from '../utils/verificationCodeGenerator';
import { generateEmailTemplate } from '../utils/emailTemplate';
import { generateResetPasswordToken } from '../utils/generateResetToken';
import { sendEmailR } from '../utils/resendEmail';
import twilio from 'twilio';

const getTwilioClient = () => {
  const sid = process.env.TWILIO_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !authToken) {
    throw new Error('TWILIO_SID and TWILIO_AUTH_TOKEN environment variables are required for phone verification');
  }
  return twilio(sid, authToken);
};

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  phone: string;
  verificationMethod: 'email' | 'phone';
}

interface VerifyOtpBody {
  email: string;
  otp: string;
  phone: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface ForgotPasswordBody {
  email: string;
}

interface ResetPasswordBody {
  password: string;
  confirmPassword: string;
}

const sendVerificationCode = async (
  verificationMethod: 'email' | 'phone',
  verificationCode: number,
  name: string,
  email: string,
  phone: string,
  res: Response
): Promise<void> => {
  try {
    if (verificationMethod === 'email') {
      const message = generateEmailTemplate(verificationCode);
      await sendEmailR({ email, subject: 'Your Verification Code', message });
      res.status(200).json({
        success: true,
        message: `Verification email successfully sent to ${name}`,
      });
    } else if (verificationMethod === 'phone') {
      const verificationCodeWithSpace = verificationCode
        .toString()
        .split('')
        .join(' ');
      const twilioClient = getTwilioClient();
      await twilioClient.calls.create({
        twiml: `<Response><Say>Your verification code is ${verificationCodeWithSpace}. Your verification code is ${verificationCodeWithSpace}.</Say></Response>`,
        from: process.env.TWILIO_PHONE_NUMBER || '',
        to: phone,
      });
      res.status(200).json({
        success: true,
        message: 'OTP sent.',
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Invalid verification method.',
      });
    }
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({
      success: false,
      message: 'Verification code failed to send.',
    });
  }
};

export const register = async (req: Request<{}, {}, RegisterBody>, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, verificationMethod } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({
      $or: [
        { email, accountVerified: true },
        { phone, accountVerified: true },
      ],
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = await User.findOne({
      $or: [
        { phone, accountVerified: false },
        { email, accountVerified: false },
      ],
    });

    if (user && user.accountVerification.length > 3) {
      throw new Error(
        'You have exceeded the maximum number of attempts (3). Please try again after an hour.'
      );
    }

    const verificationCode = generateVerificationCode();
    const verificationCodeExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    const verificationObj = {
      verificationCode,
      verificationCodeExpire,
      createdAt: new Date(),
    };

    if (!user) {
      const userData = {
        name,
        email,
        phone,
        password: hashedPassword,
        accountVerified: false,
        accountVerification: [verificationObj],
      };
      const userInfo = await User.create(userData);
      await sendVerificationCode(verificationMethod, verificationCode, userInfo.name, userInfo.email, userInfo.phone || '', res);
    } else if (user.accountVerification.length <= 3) {
      user.accountVerification = [verificationObj, ...user.accountVerification];
      await user.save();
      await sendVerificationCode(verificationMethod, verificationCode, user.name, user.email, user.phone || '', res);
    }
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
};

export const verifyOtp = async (req: Request<{}, {}, VerifyOtpBody>, res: Response): Promise<void> => {
  try {
    const { email, otp, phone } = req.body;

    const userCheck = await User.findOne({
      accountVerified: true,
      $or: [{ email }, { phone }],
    });

    if (userCheck) {
      throw new Error('User already verified');
    }

    const userData = await User.findOne({
      accountVerified: false,
      $or: [{ email }, { phone }],
    });

    if (!userData) {
      throw new Error('User not found');
    }

    let verificationEntry;
    if (userData.accountVerification.length > 1) {
      verificationEntry = userData.accountVerification[0];
      userData.accountVerification = [verificationEntry];
    } else if (userData.accountVerification.length === 1) {
      verificationEntry = userData.accountVerification[0];
    } else {
      throw new Error('Verification code not found');
    }

    if (verificationEntry.verificationCode !== Number(otp)) {
      throw new Error('Invalid OTP');
    }

    const currentTime = Date.now();
    if (currentTime > verificationEntry.verificationCodeExpire) {
      throw new Error('OTP Expired.');
    }

    userData.accountVerified = true;
    userData.accountVerification = [];
    await userData.save();

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
      emailId: userData.email,
      _id: userData._id.toString(),
    };

    res.status(201).json({
      user: reply,
      message: 'OTP is verified!',
    });
  } catch (err) {
    const error = err as Error;
    res.status(401).json({ error: error.message });
  }
};

export const login = async (req: Request<{}, {}, LoginBody>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw new Error('Invalid Credential email!');
    }
    if (!password) {
      throw new Error('Invalid Credential password!');
    }

    const userData = await User.findOne({ email, accountVerified: true }).select('+password');

    if (!userData || !userData.password) {
      throw new Error('Invalid email or password.');
    }

    const match = await bcrypt.compare(password, userData.password);
    if (!match) {
      throw new Error('Invalid Credential not matched!');
    }

    const token = jwt.sign(
      { _id: userData._id, emailId: userData.email },
      process.env.JWT_KEY || '',
      { expiresIn: 36000 }
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
      error: error.message,
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res
      .status(200)
      .cookie('token', '', {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .json({
        success: true,
        message: 'Logged out successfully',
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to logout',
    });
  }
};

export const forgotPassword = async (
  req: Request<{}, {}, ForgotPasswordBody>,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      email,
      accountVerified: true,
    });

    if (!user) {
      throw new Error('User not found.');
    }

    const { resetTokenRaw, resetTokenHashed } = generateResetPasswordToken();
    user.resetPassword.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
    user.resetPassword.resetPasswordToken = resetTokenHashed;
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/resetPassword/${resetTokenRaw}`;
    const message = `Your Reset Password Token is:- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it.`;

    try {
      await sendEmailR({
        email: user.email,
        subject: 'MERN AUTHENTICATION APP RESET PASSWORD',
        message,
      });
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully.`,
      });
    } catch (error) {
      user.resetPassword.resetPasswordToken = undefined;
      user.resetPassword.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      const err = error as Error;
      res.status(400).json({
        error: err.message || 'Cannot send reset password token.',
      });
    }
  } catch (err) {
    const error = err as Error;
    res.status(400).json({
      error: error.message,
    });
  }
};

export const resetPassword = async (
  req: Request<{ token: string }, {}, ResetPasswordBody>,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      'resetPassword.resetPasswordToken': resetPasswordToken,
      'resetPassword.resetPasswordExpire': { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Reset password token is invalid or has been expired.');
    }

    if (password !== confirmPassword) {
      throw new Error('Password & confirm password do not match.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPassword.resetPasswordToken = undefined;
    user.resetPassword.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      message: 'Password updated successfully',
    });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({
      error: error.message,
    });
  }
};

