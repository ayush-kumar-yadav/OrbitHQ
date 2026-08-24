import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "../../services/task.service";

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.createTask,

    onSuccess: () => {
      // Invalidating ["tasks", projectId] only matches that exact
      // query — React Query's default invalidation matches by
      // "starts with", so it never touched ["tasks", undefined]
      // (the general /tasks page and /tasks/kanban, which call
      // useTasks() with no project) or ["dashboard"]. Both stayed
      // silently stale after creating a task from inside a project,
      // even though that project's own task list updated correctly.
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}