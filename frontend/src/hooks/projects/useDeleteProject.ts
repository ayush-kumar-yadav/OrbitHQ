import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "../../services/project.service";

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) =>
      projectService.deleteProject(
        projectId
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}