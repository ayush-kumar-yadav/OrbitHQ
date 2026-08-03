import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "../../services/project.service";

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: {
        name?: string;
        description?: string;
      };
    }) =>
      projectService.updateProject(
        projectId,
        data
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      queryClient.invalidateQueries({
        queryKey: ["project"],
      });
    },
  });
}