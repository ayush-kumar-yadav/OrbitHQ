import { api } from "../api/client";

class ActivityService {
  async getTaskTimeline(taskId: string) {
    const response = await api.get(
      `/tasks/${taskId}/activity`
    );

    return response.data;
  }
}

export const activityService = new ActivityService();