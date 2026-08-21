import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { socketService } from "./socket.service";
import { env } from "../config/env";

interface SocketUser {
  userId: string;
  organizationId: string | null;
}

export function initializeSocket(
  httpServer: HttpServer
) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });
  socketService.initialize(io);

  // Socket authentication
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token;

      if (!token) {
        return next(
          new Error("Authentication required")
        );
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET!
      ) as {
        id: string;
        email: string;
        role: string;
        organizationId: string | null;
      };

      if (!decoded.id) {
        return next(
          new Error("Invalid authentication token")
        );
      }

      socket.data.user = {
        userId: decoded.id,
        organizationId:
          decoded.organizationId ?? null,
      } satisfies SocketUser;

      next();
    } catch (error) {
      console.error(
        "❌ Socket authentication failed:",
        error
      );

      next(
        new Error(
          "Invalid authentication token"
        )
      );
    }
  });

  io.on("connection", (socket) => {
    const {
      userId,
      organizationId,
    } = socket.data.user as SocketUser;

    console.log(
      `🔌 Socket connected: ${socket.id}`
    );

    console.log(
      `👤 User: ${userId}`
    );

    // User-specific room
    socket.join(`user:${userId}`);

    console.log(
      `👤 Joined room: user:${userId}`
    );

    // Organization room
    if (organizationId) {
      socket.join(
        `organization:${organizationId}`
      );

      console.log(
        `🏢 Joined room: organization:${organizationId}`
      );
    }

    socket.on("disconnect", () => {
      console.log(
        `🔌 Socket disconnected: ${socket.id}`
      );
    });
  });

  return io;
}