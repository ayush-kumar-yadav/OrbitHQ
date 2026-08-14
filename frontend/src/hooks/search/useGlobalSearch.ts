import { useQuery } from "@tanstack/react-query";

import { globalSearchService } from "../../services/globalSearch.service";

export function useGlobalSearch(
  query: string,
  enabled: boolean
) {
  return useQuery({
    queryKey: ["global-search", query],

    queryFn: async () => {
      const [
        projects,
        tasks,
        members,
      ] = await Promise.all([
        globalSearchService.searchProjects(
          query
        ),
        globalSearchService.searchTasks(
          query
        ),
        globalSearchService.searchMembers(
          query
        ),
      ]);

      return {
        projects:
          projects?.data?.projects ??
          projects?.data ??
          [],

        tasks:
          tasks?.data?.tasks ??
          tasks?.data ??
          [],

        members,
      };
    },

    enabled:
      enabled &&
      query.trim().length >= 2,

    staleTime: 30 * 1000,
  });
}