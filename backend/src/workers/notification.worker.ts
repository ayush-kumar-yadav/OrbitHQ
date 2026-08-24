import dotenv from "dotenv";
import { Job, Worker } from "bullmq";
import { Types } from "mongoose";

import { connectDB } from "../config/db";
import { bullRedis } from "../queues/redis.connection";
import { notificationRepository } from "../repositories/notification.repository";
import {
  redisService,
} from "../cache/redis.service";
import { CHANNEL } from "../sockets/socket.pubsub";

interface NotificationJobData {
  userId: string;
  organizationId: string;
  type: string;
  message: string;
  taskId?: string;
  actorId?: string;
}

// Builds and starts the BullMQ worker. Assumes MongoDB and Redis are
// already connected by the caller — this used to connect to both
// itself and call process.exit(1) on failure, which only made sense
// when this ran as its own standalone process. Now it can also be
// started inside server.ts (see the merged setup below), where
// killing the process on a worker-startup failure would take the
// whole web server down with it — so failures here are logged and
// swallowed instead, leaving the HTTP server running either way.
export async function startNotificationWorker(): Promise<Worker<NotificationJobData> | null> {
  try {
    const notificationWorker =
      new Worker<NotificationJobData>(
        "notifications",

        async (job: Job<NotificationJobData>) => {
          console.log(
            `🔄 Processing notification job: ${job.id}`
          );

          console.log(
            "📦 Notification:",
            job.data
          );

          // 1. Save notification to MongoDB
          const notification =
            await notificationRepository.create({
              userId: new Types.ObjectId(
                job.data.userId
              ),

              organizationId: new Types.ObjectId(
                job.data.organizationId
              ),

              type: job.data.type,

              message: job.data.message,

              taskId: job.data.taskId
                ? new Types.ObjectId(
                    job.data.taskId
                  )
                : undefined,

              actorId: job.data.actorId
                ? new Types.ObjectId(
                    job.data.actorId
                  )
                : undefined,

              isRead: false,
            });

          console.log(
            `🔔 Notification created: ${notification._id}`
          );

          // 2. Publish real-time event through Redis
          await redisService
  .getClient()
  .publish(
            CHANNEL,
            JSON.stringify({
              event: "notification:created",
              userId: job.data.userId,
              notification,
            })
          );

          console.log(
            `📡 Notification event published for user:${job.data.userId}`
          );

          return {
            success: true,
            notificationId:
              notification._id.toString(),
          };
        },

        {
          connection: bullRedis,
          concurrency: 5,
        }
      );

    notificationWorker.on(
      "completed",
      (job) => {
        console.log(
          `✅ Job completed: ${job.id}`
        );
      }
    );

    notificationWorker.on(
      "failed",
      (job, error) => {
        console.error(
          `❌ Job failed: ${job?.id}`,
          error.message
        );
      }
    );

    notificationWorker.on(
      "error",
      (error) => {
        console.error(
          "❌ Worker error:",
          error
        );
      }
    );

    console.log(
      "👷 Notification worker started"
    );

    return notificationWorker;
  } catch (error) {
    console.error(
      "❌ Failed to start notification worker:",
      error
    );

    return null;
  }
}

// Standalone entry point — still works exactly as before if you run
// this file directly (`npm run dev:worker` / `node dist/workers/
// notification.worker.js`), e.g. for local development or if you
// later move to a paid host that runs it as its own service. In that
// case it owns its own env/DB/Redis connections and does exit on a
// genuine startup failure, since there's no web server in this
// process to protect.
if (require.main === module) {
  (async () => {
    dotenv.config();

    try {
      await connectDB();
      console.log("🟢 Worker MongoDB connected");

      await redisService.connect();
      console.log("🟢 Worker Redis connected");

      const worker = await startNotificationWorker();

      if (!worker) {
        throw new Error("Worker failed to start");
      }
    } catch (error) {
      console.error(
        "❌ Failed to start standalone notification worker:",
        error
      );

      process.exit(1);
    }
  })();
}