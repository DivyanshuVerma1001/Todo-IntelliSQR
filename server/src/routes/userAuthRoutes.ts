import express from 'express';
import {
  register,
  verifyOtp,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from '../controller/userAuth.js';
import { googleLogin, googleRegister } from '../controller/userGoogleAuth.js';
import { userMiddleware, AuthRequest } from '../middleware/userMiddleware.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/otpverification', verifyOtp);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/forgotPassword', forgotPassword);
authRouter.post('/resetPassword/:token', resetPassword);
authRouter.get('/googleLogin', googleLogin);
authRouter.get('/googleRegister', googleRegister);
authRouter.get('/check', userMiddleware, (req: AuthRequest, res) => {
  if (!req.result) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const reply = {
    name: req.result.name,
    emailId: req.result.email,
    _id: req.result._id,
  };

  res.status(200).json({
    user: reply,
    message: 'Valid user',
  });
});

export default authRouter;

