import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../model/user';

export interface AuthRequest<P = {}, ResBody = {}, ReqBody = {}, ReqQuery = {}> extends Request<P, ResBody, ReqBody, ReqQuery> {
  result?: {
    _id: string;
    name: string;
    email: string;
  };
}

export const userMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error('Token is not present');
    }

    const payload = jwt.verify(token, process.env.JWT_KEY || '') as { _id: string; emailId: string };
    const { _id } = payload;

    if (!_id) {
      throw new Error('Invalid token');
    }

    const result = await User.findById(_id);
    if (!result) {
      throw new Error("User doesn't exist");
    }

    req.result = {
      _id: result._id.toString(),
      name: result.name,
      email: result.email,
    };
    next();
  } catch (err) {
    const error = err as Error;
    res.status(401).json({ message: error.message });
  }
};

