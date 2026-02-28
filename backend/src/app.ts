import express from 'express';
import connectDB from './config/db';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';
import morgan from 'morgan';
import { stream } from './utils/logger';

const app = express();
dotenv.config();
connectDB();
app.use((req, res, next) => {
  console.log(`Incoming: ${req.method} ${req.url}`);
  next();
});
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use((req, res, next) => {
  if (req.method === 'PATCH') {
    console.log('PATCH Request Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});
app.use(function (req, res, next) {
  res.set(
    'Cache-Control',
    'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
  );
  next();
});
app.use(morgan('combined', { stream }));

import authRoute from './api/routes/auth.route';
import adminRoute from './api/routes/admin/admin.route';
import userRoute from './api/routes/user/user.route';
import trainerRoute from './api/routes/trainer/trainer.route';
import uploadRoute from './api/routes/upload.routes';
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/trainer', trainerRoute);
app.use('/api/v1/upload', uploadRoute);
app.use(errorHandler);

export default app;
