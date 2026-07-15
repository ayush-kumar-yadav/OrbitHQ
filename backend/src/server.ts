import dotenv from "dotenv";

dotenv.config();

import app from "./app";

import { connectDB } from "./config/db";
import { connectRedis } from "./config/redis";
import { logger } from "./utils/logger";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    await connectRedis();

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