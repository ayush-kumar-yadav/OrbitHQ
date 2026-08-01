import { useQuery } from "@tanstack/react-query";
import { taskService } from "../../services/task.service";

export function useTasks(projectId?: string) {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => taskService.getTasks(projectId ?? ""),
  });
}