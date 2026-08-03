import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "../../services/project.service";

export function useArchiveProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) =>
      projectService.archiveProject(
        projectId
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}