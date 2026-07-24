import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Project name is required")
    .max(100, "Project name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .optional(),

  description: z
    .string()
    .trim()
    .optional(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;