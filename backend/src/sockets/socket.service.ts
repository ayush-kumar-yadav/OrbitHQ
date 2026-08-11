import { Server } from "socket.io";
import { SOCKET_EVENTS } from "./socket.events";

class SocketService {
  private io: Server | null = null;

  initialize(io: Server) {
    this.io = io;
  }

  emitToUser(
    userId: string,
    event: string,
    data: unknown
  ) {
    if (!this.io) {
      console.warn(
        "⚠️ Socket.IO is not initialized"
      );
      return;
    }

    this.io
      .to(`user:${userId}`)
      .emit(event, data);
  }

  emitNotification(
    userId: string,
    notification: unknown
  ) {
    this.emitToUser(
      userId,
      SOCKET_EVENTS.NOTIFICATION_CREATED,
      notification
    );
  }
}

export const socketService =
  new SocketService();