import { SocketAuthMiddleware } from '../middleware/socket.auth.middleware';
import { AuthenticatedSocket } from './socket.types';
import { io } from '../server';
import { chatHandler } from '@/container';

export const initSocket = () => {
  console.log('hello  socket');
  io.use(SocketAuthMiddleware);

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log('goining to connect');
    const authSocket = socket as AuthenticatedSocket;
    console.log(authSocket.user);

    console.log(`Socket connected: ${authSocket.user.email} (${authSocket.user.id})`);
    authSocket.join(authSocket.user.id);
    chatHandler(io, authSocket);

    authSocket.on('disconnect', () => {
      console.log(`Socket disconnected: ${authSocket.user.email}`);
    });
  });
};
