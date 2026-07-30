import { useMutation } from "@tanstack/react-query";
import { organizationService } from "../../services/organization.service";

export function useCreateOrganization() {
  return useMutation({
    mutationFn: organizationService.createOrganization,
  });
}