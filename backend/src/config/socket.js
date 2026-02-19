import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    socket.on('joinStock', (symbol) => socket.join(symbol));
    socket.on('leaveStock', (symbol) => socket.leave(symbol));
  });

  return io;
};

export const getIO = () => io;
