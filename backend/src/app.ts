import express, { urlencoded } from 'express';
import connectDB from './config/db';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';

const app = express();
dotenv.config();
connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL||'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


import authRoutes from './api/routes/auth.route';
import adminRoute from './api/routes/admin/admin.route';
import profileRoutes from './api/routes/profile.route';;

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/admin',adminRoute)

app.use(errorHandler);
export default app;
