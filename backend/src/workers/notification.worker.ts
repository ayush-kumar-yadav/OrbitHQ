import dotenv from "dotenv";

dotenv.config();
import { Job, Worker } from "bullmq";

import { bullRedis } from "../queues/redis.connection";

interface NotificationJobData {
  userId: string;
  type: string;
  message: string;
}

const notificationWorker =
  new Worker<NotificationJobData>(
    "notifications",

    async (job: Job<NotificationJobData>) => {
      console.log(
        `🔄 Processing notification job: ${job.id}`
      );

      console.log(
        "📦 Job data:",
        job.data
      );

      // Simulate background processing
      await new Promise(
        (resolve) =>
          setTimeout(resolve, 1000)
      );

      console.log(
        `✅ Notification job completed: ${job.id}`
      );

      return {
        success: true,
        jobId: job.id,
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