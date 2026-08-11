import { notificationQueue } from "../queues/notification.queue";

interface NotificationJobData {
  userId: string;
  organizationId: string;
  type: string;
  message: string;
  taskId?: string;
  actorId?: string;
}

class QueueService {
  async addNotificationJob(
    data: NotificationJobData
  ) {
    const job = await notificationQueue.add(
      "send-notification",
      data
    );

    console.log(
      `📨 Notification job queued: ${job.id}`
    );

    return job;
  }
}

export const queueService =
  new QueueService();