import mongoose from 'mongoose';

export const DBconnect = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.DB_CONNECT_STRING || '');
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

