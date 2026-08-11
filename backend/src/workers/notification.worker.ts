import dotenv from "dotenv";

dotenv.config();

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

const startWorker = async () => {
  try {
    // MongoDB
    await connectDB();

    console.log(
      "🟢 Worker MongoDB connected"
    );

    // Redis Pub/Sub client
    await redisService.connect();

    console.log(
      "🟢 Worker Redis connected"
    );

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
  } catch (error) {
    console.error(
      "❌ Failed to start notification worker:",
      error
    );

    process.exit(1);
  }
};

startWorker();