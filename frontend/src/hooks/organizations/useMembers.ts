import { useQuery } from "@tanstack/react-query";

import { organizationService } from "../../services/organization.service";

export function useMembers() {
  return useQuery({
    queryKey: ["members"],
    queryFn: organizationService.getMembers,
  });
}