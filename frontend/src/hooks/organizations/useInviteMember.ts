import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { organizationService } from "../../services/organization.service";

export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: organizationService.inviteMember,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members"],
      });
    },
  });
}