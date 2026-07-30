import { useQuery } from "@tanstack/react-query";
import { projectService } from "../../services/project.service";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: projectService.getProjects,
  });
}