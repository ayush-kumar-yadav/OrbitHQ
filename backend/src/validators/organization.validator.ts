import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Organization name must be at least 3 characters")
    .max(100, "Organization name cannot exceed 100 characters"),
});

export type CreateOrganizationInput =
  z.infer<typeof createOrganizationSchema>;
  import { UserRole } from "../constants/roles";

export const inviteMemberSchema = z.object({
  email: z.email("Invalid email address"),

  role: z.enum([
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.DEVELOPER,
    UserRole.VIEWER,
  ]),
});

export type InviteMemberInput = z.infer<
  typeof inviteMemberSchema
>;