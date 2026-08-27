import dotenv from 'dotenv';
dotenv.config();
import config from './config/config';
import connectDB from './config/db';
import { redisClientService } from './container';
import { startAutoCompleteSessionsJob } from './jobs/autoCompleteSessions.job';
import { httpServer } from './server';
import { initSocket } from './socket/socket';
import { startReleasePayoutHoldsJob } from './jobs/releasePayoutHold.job';

const start = async () => {
  await connectDB();
  await redisClientService.connect();
  startAutoCompleteSessionsJob();
  startReleasePayoutHoldsJob();
  initSocket();
  const PORT = config.port;
  httpServer.listen(PORT, () => {
    console.log(`Server Running.... on port ${PORT}`);
  });
};
start();
