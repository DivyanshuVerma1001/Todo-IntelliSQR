import mongoose, { Schema, Document } from 'mongoose';

interface IAccountVerification {
  verificationCode: number;
  verificationCodeExpire: number;
  createdAt: Date;
}

interface IResetPassword {
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  accountVerified: boolean;
  accountVerification: IAccountVerification[];
  resetPassword: IResetPassword;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minLength: [8, 'Length must have at least 8 characters'],
    select: false,
  },
  phone: {
    type: String,
  },
  accountVerified: {
    type: Boolean,
    default: false,
  },
  accountVerification: [
    {
      verificationCode: {
        type: Number,
      },
      verificationCodeExpire: {
        type: Number,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  resetPassword: {
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
});

export const User = mongoose.model<IUser>('User', userSchema);

