import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { commentService } from "../../services/comment.service";

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      content,
    }: {
      taskId: string;
      content: string;
    }) =>
      commentService.createComment(
        taskId,
        content
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "comments",
          variables.taskId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "activity",
          variables.taskId,
        ],
      });
    },
  });
}