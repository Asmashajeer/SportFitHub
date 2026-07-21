import dotenv from 'dotenv';
dotenv.config();
import config from './config/config';
import app from './app';
import connectDB from './config/db';
import { redisClientService } from './container';
import { startAutoCompleteSessionsJob } from './jobs/autoCompleteSessions.job';
import { httpServer } from './server';
import { initSocket } from './socket/socket';

const start = async () => {
  await connectDB();
  await redisClientService.connect();
  startAutoCompleteSessionsJob();
  initSocket();
  const PORT = config.port;
  httpServer.listen(PORT, () => {
    console.log(`Server Running.... on port ${PORT}`);
  });
};
start();
