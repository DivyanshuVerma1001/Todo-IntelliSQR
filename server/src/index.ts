import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/userAuthRoutes.js';
import todoRouter from './routes/todoRoutes.js';
import { DBconnect } from './database/dbConnection.js';

const app = express();

// Get allowed origins from environment variable or use defaults
const getAllowedOrigins = (): string[] => {
  const envOrigins = process.env.ALLOWED_ORIGINS;
  if (envOrigins) {
    return envOrigins.split(',').map(origin => origin.trim());
  }
  // Default origins for development
  return ['http://localhost:5173'];
};

const allowedOrigins = getAllowedOrigins();

// Add production frontend URL if provided
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

console.log('Allowed CORS origins:', allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: 'backend is alive',
  });
});

app.use('/api/user', authRouter);
app.use('/api/todos', todoRouter);

const port = process.env.PORT || 3000;

DBconnect()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(port, () => {
      console.log(`Server listening at port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error:', err);
  });

