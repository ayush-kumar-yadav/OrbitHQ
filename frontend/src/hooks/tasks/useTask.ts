import { useQuery } from "@tanstack/react-query";
import { taskService } from "../../services/task.service";

export function useTask(taskId: string) {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => taskService.getTaskById(taskId),
    enabled: !!taskId,
  });
}