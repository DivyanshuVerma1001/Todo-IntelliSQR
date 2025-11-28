import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/userAuthRoutes';
import { DBconnect } from './database/dbConnection';

const app = express();
const allowedOrigins = ['http://localhost:5173'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
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

