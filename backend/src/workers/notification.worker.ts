import { Job, Worker } from "bullmq";
import { Types } from "mongoose";

import { bullRedis } from "../queues/redis.connection";
import { notificationRepository } from "../repositories/notification.repository";
import { redisService } from "../cache/redis.service";
import { CHANNEL } from "../sockets/socket.pubsub";

interface NotificationJobData {
  userId: string;
  organizationId: string;
  type: string;
  message: string;
  taskId?: string;
  actorId?: string;
}

export function startNotificationWorker(): Worker<NotificationJobData> {
  const worker = new Worker<NotificationJobData>(
    "notifications",
    async (job: Job<NotificationJobData>) => {
      console.log(
        `🔄 Processing notification job: ${job.id}`
      );

      console.log(
        "📦 Notification:",
        job.data
      );

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
            ? new Types.ObjectId(job.data.taskId)
            : undefined,

          actorId: job.data.actorId
            ? new Types.ObjectId(job.data.actorId)
            : undefined,

          isRead: false,
        });

      console.log(
        `🔔 Notification created: ${notification._id}`
      );

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

  worker.on("ready", () => {
    console.log(
      "🟢 Notification worker READY"
    );
  });

  worker.on("completed", (job) => {
    console.log(
      `✅ Notification job completed: ${job.id}`
    );
  });

  worker.on("failed", (job, error) => {
    console.error(
      `❌ Notification job failed: ${job?.id}`,
      error
    );
  });

  worker.on("error", (error) => {
    console.error(
      "❌ Notification worker error:",
      error
    );
  });

  console.log(
    "👷 Notification worker created"
  );

  return worker;
}