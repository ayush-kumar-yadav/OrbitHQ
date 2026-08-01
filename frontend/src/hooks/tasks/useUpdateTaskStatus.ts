import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { taskService } from "../../services/task.service";

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      status,
    }: {
      taskId: string;
      status: string;
    }) =>
      taskService.updateTaskStatus(
        taskId,
        status
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["task", variables.taskId],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}