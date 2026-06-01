import dotenv from 'dotenv';
dotenv.config();
import config from './config/config';
import app from './app'; 
import connectDB from './config/db';
import { redisClientService } from './container';

const start = async () => {    
    await connectDB();
    await redisClientService.connect();  
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`Server Running.... on port ${PORT}`);
    });
} 
start();



