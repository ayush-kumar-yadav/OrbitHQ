import { useQuery } from "@tanstack/react-query";
import { commentService } from "../../services/comment.service";

export function useComments(taskId: string) {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => commentService.getComments(taskId),
    enabled: !!taskId,
  });
}