import { useQuery } from "@tanstack/react-query";
import { projectService } from "../../services/project.service";

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projectService.getProjectById(projectId),
    enabled: !!projectId,
  });
}