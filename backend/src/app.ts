import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';
import morgan from 'morgan';
import { stream } from './utils/logger';
import rootRouter from './api/routes';
import webhookRoutes from './api/routes/booking/webhook.route'
import './config/firebase.admin.config'
import cron from 'node-cron';

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use('/api/v1/webhook', webhookRoutes);

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

app.use(function (req, res, next) {
  res.set(
    'Cache-Control',
    'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
  );
  next();
});
app.use(morgan('combined', { stream }));




app.use('/api/v1', rootRouter);



app.use(errorHandler);

export default app;
