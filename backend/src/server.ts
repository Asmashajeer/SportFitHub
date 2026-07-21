import http from 'http';
import { Server } from 'socket.io';
import app from './app';

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
});

io.engine.on('connection_error', (err) => {
  console.log('ENGINE CONNECTION ERROR:', {
    code: err.code,
    message: err.message,
    context: err.context,
    req: err.req?.url,
  });
});
export { httpServer, io };
