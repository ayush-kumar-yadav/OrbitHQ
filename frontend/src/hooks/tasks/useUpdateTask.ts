import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { taskService } from "../../services/task.service";

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: any;
    }) => taskService.updateTask(taskId, data),

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