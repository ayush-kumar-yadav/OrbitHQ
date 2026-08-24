import { io } from "socket.io-client";

// Falls back to VITE_API_URL (stripping a trailing /api/v1) so a
// deployment only has to set one env var, but VITE_SOCKET_URL can
// override it if the socket server lives at a different host.
const API_URL = import.meta.env.VITE_API_URL as string | undefined;
const SOCKET_URL =
  (import.meta.env.VITE_SOCKET_URL as string | undefined) ||
  API_URL?.replace(/\/api\/v1\/?$/, "") ||
  "http://localhost:5000";

export const socket = io(SOCKET_URL, {
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