import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";
import { logger } from "./utils/logger";
import { env } from "./config/env";
import { redisService } from "./cache/redis.service";
import http from "http";
import { initializeSocket } from "./sockets/socket.server";
import { initializeSocketPubSub } from "./sockets/socket.pubsub";
import { startNotificationWorker } from "./workers/notification.worker";
const PORT = env.PORT;

async function startServer() {
  try {
    await connectDB();
    await redisService.connect();

    const httpServer = http.createServer(app);

initializeSocket(httpServer);
await initializeSocketPubSub();

// Runs the BullMQ notification worker inside this same process,
// reusing the MongoDB/Redis connections established above. This
// keeps the whole app (API + realtime + background jobs) on a
// single deployable service — free-tier hosts like Render don't
// offer a free background-worker service type, so this is what
// makes notifications actually work without a paid second service.
// A failure here is logged, not fatal — the web server and API
// still come up either way.
try {
  const worker = await startNotificationWorker();

  if (worker) {
    logger.info("👷 Notification worker running in-process");
  } else {
    logger.error(
      "⚠️  Notification worker failed to start — notifications will queue but not be processed."
    );
  }
} catch (error) {
  logger.error("⚠️  Notification worker failed to start:");
  logger.error(error);
}

httpServer.listen(PORT, () => {
  logger.info(
    `🚀 Server running on port ${PORT}`
  );
});
  } catch (error) {
    logger.error("Failed to start server");
    logger.error(error);

    process.exit(1);
  }
}

startServer();