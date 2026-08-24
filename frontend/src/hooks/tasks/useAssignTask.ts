import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { taskService } from "../../services/task.service";

export function useAssignTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      assignee,
    }: {
      taskId: string;
      assignee: string;
    }) => taskService.assignTask(taskId, assignee),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["task", variables.taskId],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}