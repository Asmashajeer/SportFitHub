import {Socket,io } from 'socket.io-client';
const SOCKET_URL = import.meta.env.VITE_SERVER_URL;

export const socket: Socket = io(SOCKET_URL, {
  withCredentials: true, // for cookies along with the handshake
  autoConnect: false,     
});

// socket.on('connect', () => {
//   console.log('Socket connected:', socket.id);
// });

// socket.on('disconnect', (reason) => {
//   console.log('Socket disconnected:', reason);
// });

// socket.on('connect_error', (err) => {
//   console.error('Socket connection error:', err.message);
// });