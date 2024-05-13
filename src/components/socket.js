import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = (user, name) => {
  if (!socket) {
    socket = io("https://mediflow-cse416.onrender.com");
    socket.emit('userConnected', user, name);
    console.log('Socket initialized and user connected:', user);
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected');
  }
};

export const getSocket = () => socket;
