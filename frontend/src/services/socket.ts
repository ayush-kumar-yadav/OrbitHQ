import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  autoConnect: false,
  withCredentials: true,
});

export function connectSocket(token: string) {
  socket.auth = {
    token,
  };

  if (!socket.connected) {
    socket.connect();
  }
}

export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
  }
}