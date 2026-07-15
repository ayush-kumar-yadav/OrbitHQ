import { createClient } from "redis";

import { logger } from "../utils/logger";

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on("error", err => {
  logger.error(err);
});

export async function connectRedis() {
  await redisClient.connect();

  logger.info("Redis Connected");
}

export default redisClient;