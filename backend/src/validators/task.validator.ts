import { z } from "zod";
import { Types } from "mongoose";

import { TaskPriority, TaskStatus } from "../constants/task";

const objectIdSchema = z
  .string()
  .refine((id) => Types.ObjectId.isValid(id), {
    message: "Invalid ObjectId",
  });

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200),

  description: z
    .string()
    .trim()
    .optional(),

  projectId: objectIdSchema,

  assignee: objectIdSchema.optional(),

  priority: z
    .nativeEnum(TaskPriority)
    .optional(),

  status: z
    .nativeEnum(TaskStatus)
    .optional(),

  dueDate: z
    .string()
    .datetime()
    .optional(),

  tags: z
    .array(z.string().trim())
    .optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const assignTaskSchema = z.object({
  assignee: objectIdSchema,
});

export const updateTaskStatusSchema = z.object({
  status: z.nativeEnum(TaskStatus),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type AssignTaskInput = z.infer<typeof assignTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;