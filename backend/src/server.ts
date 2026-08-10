import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";
import { logger } from "./utils/logger";
import { env } from "./config/env";
import { redisService } from "./cache/redis.service";
const PORT = env.PORT;

async function startServer() {
  try {
    await connectDB();
    await redisService.connect();

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server");
    logger.error(error);

    process.exit(1);
  }
}

startServer();