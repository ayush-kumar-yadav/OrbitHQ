import { useQuery } from "@tanstack/react-query";

import { activityService } from "../../services/activity.service";

export function useTaskActivity(
  taskId: string
) {
  return useQuery({
    queryKey: ["activity", taskId],

    queryFn: () =>
      activityService.getTaskTimeline(taskId),

    enabled: !!taskId,
  });
}