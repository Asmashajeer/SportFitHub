import { SocketAuthMiddleware } from '../middleware/socket.auth.middleware';
import { AuthenticatedSocket } from './socket.types';
import { io } from '../server';
import { chatHandler, videoCallHandler } from '@/container';

export const initSocket = () => {
 
  io.use(SocketAuthMiddleware);

  io.on('connection', (socket: AuthenticatedSocket) => {
  
    const authSocket = socket as AuthenticatedSocket;
    

    console.log(`Socket connected: ${authSocket.user.email} (${authSocket.user.id})`);
    authSocket.join(authSocket.user.id);
    chatHandler(io, authSocket);
    videoCallHandler(io, authSocket); 
    authSocket.on('disconnect', () => {
      console.log(`Socket disconnected: ${authSocket.user.email}`);
    });
  });
};
