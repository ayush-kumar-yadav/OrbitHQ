import { RedisClientType } from "redis";

import { redisService } from "../cache/redis.service";
import { socketService } from "./socket.service";

export const CHANNEL = "orbithq:socket";

export async function initializeSocketPubSub() {
  const subscriber =
    redisService.getClient().duplicate() as RedisClientType;

  subscriber.on("error", (error) => {
    console.error(
      "🔴 Socket Pub/Sub Redis error:",
      error
    );
  });

  await subscriber.connect();

  await subscriber.subscribe(
    CHANNEL,
    (message: string) => {
        console.log(
  "📨 Socket Pub/Sub received:",
  message
);
      try {
        const data = JSON.parse(message);

        if (
          data.event ===
          "notification:created"
        ) {
          socketService.emitNotification(
            data.userId,
            data.notification
          );
        }
      } catch (error) {
        console.error(
          "❌ Socket Pub/Sub message error:",
          error
        );
      }
    }
  );

  console.log(
    `📡 Socket Pub/Sub subscribed: ${CHANNEL}`
  );

  return subscriber;
}