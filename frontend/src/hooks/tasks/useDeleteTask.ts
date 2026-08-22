import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { taskService } from "../../services/task.service";

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => taskService.deleteTask(taskId),

    onSuccess: () => {
      // The list this task belonged to (project tasks, all tasks,
      // dashboard counts) is now stale — invalidate broadly rather
      // than trying to know every list that might have included it.
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}