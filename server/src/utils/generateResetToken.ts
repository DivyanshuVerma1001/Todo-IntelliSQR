import crypto from 'crypto';

export interface ResetTokenPair {
  resetTokenRaw: string;
  resetTokenHashed: string;
}

export const generateResetPasswordToken = (): ResetTokenPair => {
  const resetTokenRaw = crypto.randomBytes(20).toString('hex');
  const resetTokenHashed = crypto
    .createHash('sha256')
    .update(resetTokenRaw)
    .digest('hex');

  return { resetTokenRaw, resetTokenHashed };
};

