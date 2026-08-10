import IORedis from "ioredis";

import { env } from "../config/env";

export const bullRedis = new IORedis(
  env.REDIS_URL,
  {
    maxRetriesPerRequest: null,
  }
);

bullRedis.on("connect", () => {
  console.log("🟡 BullMQ Redis connecting...");
});

bullRedis.on("ready", () => {
  console.log("🟢 BullMQ Redis ready");
});

bullRedis.on("error", (error) => {
  console.error(
    "🔴 BullMQ Redis error:",
    error
  );
});