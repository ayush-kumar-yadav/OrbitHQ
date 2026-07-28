import { Request, Response } from "express";

import { asyncHandler } from "../middleware/asyncHandler";
import { successResponse } from "../responses/apiResponse";

import { taskService } from "../services/task.service";

class TaskController {
  createTask = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("REQ BODY:", req.body);

    const task = await taskService.createTask(
      {
        id: req.user.id,
        organizationId: req.user.organizationId,
      },
      req.body
    );

    return res.status(201).json(
      successResponse(task, "Task created successfully")
    );
  }
);

  getAllTasks = asyncHandler(
    async (req: Request, res: Response) => {
      const result = await taskService.getAllTasks(
        {
          organizationId: req.user.organizationId,
        },
        req.query as any
      );

      return res.status(200).json(
        successResponse(result, "Tasks fetched successfully")
      );
    }
  );

  getTaskById = asyncHandler(
    async (req: Request, res: Response) => {
      const task = await taskService.getTaskById(
        {
          organizationId: req.user.organizationId,
        },
        req.params.id as string
      );

      return res.status(200).json(
        successResponse(task, "Task fetched successfully")
      );
    }
  );

  updateTask = asyncHandler(
    async (req: Request, res: Response) => {
      const task = await taskService.updateTask(
        {
          id: req.user.id,
          organizationId: req.user.organizationId,
        },
        req.params.id as string,
        req.body
      );

      return res.status(200).json(
        successResponse(task, "Task updated successfully")
      );
    }
  );

  assignTask = asyncHandler(
    async (req: Request, res: Response) => {
      const task = await taskService.assignTask(
        {
          id: req.user.id,
          organizationId: req.user.organizationId,
        },
        req.params.id as string,
        req.body
      );

      return res.status(200).json(
        successResponse(task, "Task assigned successfully")
      );
    }
  );

  updateTaskStatus = asyncHandler(
    async (req: Request, res: Response) => {
      const task = await taskService.updateTaskStatus(
        {
          id: req.user.id,
          organizationId: req.user.organizationId,
        },
        req.params.id as string,
        req.body
      );

      return res.status(200).json(
        successResponse(task, "Task status updated successfully")
      );
    }
  );

  deleteTask = asyncHandler(
    async (req: Request, res: Response) => {
      await taskService.deleteTask(
        {
          id: req.user.id,
          organizationId: req.user.organizationId,
        },
        req.params.id as string
      );

      return res.status(200).json(
        successResponse(null, "Task deleted successfully")
      );
    }
  );
}

export const taskController = new TaskController();