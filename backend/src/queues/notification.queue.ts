import { Queue } from "bullmq";

import { bullRedis } from "./redis.connection";

export const notificationQueue =
  new Queue("notifications", {
    connection: bullRedis,

    defaultJobOptions: {
      attempts: 3,

      backoff: {
        type: "exponential",
        delay: 2000,
      },

      removeOnComplete: 100,

      removeOnFail: 500,
    },
  });

notificationQueue.on(
  "error",
  (error) => {
    console.error(
      "❌ Notification queue error:",
      error
    );
  }
);