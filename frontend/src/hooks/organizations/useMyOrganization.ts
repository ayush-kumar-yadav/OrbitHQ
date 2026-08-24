import { useQuery } from "@tanstack/react-query";

import { organizationService } from "../../services/organization.service";
import { useAuth } from "../../providers/AuthProvider";

export function useMyOrganization() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["organization", "me"],
    queryFn: organizationService.getMyOrganization,
    // Only fetch once the user actually belongs to an organization —
    // calling this before then returns a 400 from the backend.
    enabled: !!user?.organizationId,
  });
}