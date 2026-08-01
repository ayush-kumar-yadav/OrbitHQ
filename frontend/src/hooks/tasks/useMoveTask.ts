import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "../../services/task.service";

export function useMoveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      status,
    }: {
      taskId: string;
      status: string;
    }) => taskService.updateTaskStatus(taskId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}