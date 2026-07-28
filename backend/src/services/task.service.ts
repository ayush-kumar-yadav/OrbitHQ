import { FilterQuery, Types } from "mongoose";

import { HTTPSTATUS } from "../config/http.config";
import { ApiError } from "../errors/ApiError";
import { activityService } from "./activity.service";
import { ActivityAction } from "../constants/activity";
import {
  createTaskSchema,
  updateTaskSchema,
  assignTaskSchema,
  updateTaskStatusSchema,
  CreateTaskInput,
  UpdateTaskInput,
  AssignTaskInput,
  UpdateTaskStatusInput,
} from "../validators/task.validator";

import { taskRepository } from "../repositories/task.repository";
import { projectRepository } from "../repositories/project.repository";
import { userRepository } from "../repositories/user.repository";

import { ITask } from "../models/task.model";
import { TaskPriority, TaskStatus } from "../constants/task";

class TaskService {
  /**
   * Ensure authenticated user belongs to an organization.
   */
  private ensureOrganization(user: {
    organizationId: string | null;
  }) {
    if (!user.organizationId) {
      throw new ApiError(
        HTTPSTATUS.BAD_REQUEST,
        "User does not belong to an organization"
      );
    }
  }

  /**
   * Fetch task or throw 404.
   */
  private async getTaskOrThrow(taskId: string) {
    const task = await taskRepository.findTaskById(taskId);

    if (!task) {
      throw new ApiError(
        HTTPSTATUS.NOT_FOUND,
        "Task not found"
      );
    }

    return task;
  }

  /**
   * Ensure task belongs to current organization.
   */
  private ensureTaskAccess(
    task: any,
    organizationId: string
  ) {
    if (
      task.organizationId.toString() !==
      organizationId
    ) {
      throw new ApiError(
        HTTPSTATUS.FORBIDDEN,
        "You do not have access to this task"
      );
    }
  }

  async createTask(
    user: {
      id: string;
      organizationId: string | null;
    },
    body: CreateTaskInput
  ) {
    this.ensureOrganization(user);

    const data = createTaskSchema.parse(body);

    const project =
      await projectRepository.findById(
        data.projectId
      );

    if (!project) {
      throw new ApiError(
        HTTPSTATUS.NOT_FOUND,
        "Project not found"
      );
    }

    if (
      project.organizationId.toString() !==
      user.organizationId
    ) {
      throw new ApiError(
        HTTPSTATUS.FORBIDDEN,
        "Project does not belong to your organization"
      );
    }

    if (data.assignee) {
      const assignee =
        await userRepository.findById(
          data.assignee
        );

      if (!assignee) {
        throw new ApiError(
          HTTPSTATUS.NOT_FOUND,
          "Assignee not found"
        );
      }

      if (
        assignee.organizationId?.toString() !==
        user.organizationId
      ) {
        throw new ApiError(
          HTTPSTATUS.FORBIDDEN,
          "Assignee belongs to another organization"
        );
      }
    }

    const task = await taskRepository.createTask({
      title: data.title,
      description: data.description,
      projectId: new Types.ObjectId(
        data.projectId
      ),
      organizationId: new Types.ObjectId(
        user.organizationId
      ),
      assignee: data.assignee
        ? new Types.ObjectId(data.assignee)
        : undefined,
      reporter: new Types.ObjectId(user.id),
      priority:
        data.priority ??
        TaskPriority.MEDIUM,
      status:
        data.status ??
        TaskStatus.TODO,
      dueDate: data.dueDate
        ? new Date(data.dueDate)
        : undefined,
      tags: data.tags ?? [],
    });

    await activityService.log({
      organizationId: user.organizationId!,
      actor: user.id,
      taskId: String(task._id),
      entity: "TASK",
      action: ActivityAction.TASK_CREATED,
      newValue: {
        title: task.title,
        status: task.status,
        priority: task.priority,
      },
    });

    return task;
  }

  async getAllTasks(
  user: {
    organizationId: string | null;
  },
  query: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    priority?: string;
    assignee?: string;
    projectId?: string;
    sort?: string;
  }
) {
  this.ensureOrganization(user);

  const organizationId = user.organizationId!;

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter: FilterQuery<ITask> = {
    organizationId: new Types.ObjectId(organizationId),
    deletedAt: null,
  };

  if (query.search) {
    filter.title = {
      $regex: query.search,
      $options: "i",
    };
  }

  if (query.status) {
    filter.status = query.status as TaskStatus;
  }

  if (query.priority) {
    filter.priority = query.priority as TaskPriority;
  }

  if (query.assignee) {
    filter.assignee = new Types.ObjectId(query.assignee);
  }

  if (query.projectId) {
    filter.projectId = new Types.ObjectId(query.projectId);
  }

  let sort: Record<string, 1 | -1> = {
    createdAt: -1,
  };

  if (query.sort) {
    const field = query.sort.startsWith("-")
      ? query.sort.substring(1)
      : query.sort;

    const order: 1 | -1 = query.sort.startsWith("-")
      ? -1
      : 1;

    sort = {
      [field]: order,
    };
  }

  const [tasks, total] = await Promise.all([
    taskRepository.findTasks(filter, {
      skip,
      limit,
      sort,
    }),
    taskRepository.count(filter),
  ]);

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

  async getTaskById(
    user: {
      organizationId: string | null;
    },
    taskId: string
  ) {
    this.ensureOrganization(user);

    const task =
      await this.getTaskOrThrow(taskId);

    this.ensureTaskAccess(
      task,
      user.organizationId!
    );

    return task;
  }

    async updateTask(
    user: {
      id: string;
      organizationId: string | null;
    },
    taskId: string,
    body: UpdateTaskInput
  ) {
    this.ensureOrganization(user);

    const data = updateTaskSchema.parse(body);

    const task = await this.getTaskOrThrow(taskId);

    this.ensureTaskAccess(
      task,
      user.organizationId!
    );

    if (data.projectId) {
      const project =
        await projectRepository.findById(
          data.projectId
        );

      if (!project) {
        throw new ApiError(
          HTTPSTATUS.NOT_FOUND,
          "Project not found"
        );
      }

      if (
        project.organizationId.toString() !==
        user.organizationId
      ) {
        throw new ApiError(
          HTTPSTATUS.FORBIDDEN,
          "Project does not belong to your organization"
        );
      }
    }

    if (data.assignee) {
      const assignee =
        await userRepository.findById(
          data.assignee
        );

      if (!assignee) {
        throw new ApiError(
          HTTPSTATUS.NOT_FOUND,
          "Assignee not found"
        );
      }

      if (
        assignee.organizationId?.toString() !==
        user.organizationId
      ) {
        throw new ApiError(
          HTTPSTATUS.FORBIDDEN,
          "Assignee belongs to another organization"
        );
      }
    }

    const updatedTask = await taskRepository.updateTask(taskId, {
      ...data,
      projectId: data.projectId
        ? new Types.ObjectId(data.projectId)
        : undefined,
      assignee: data.assignee
        ? new Types.ObjectId(data.assignee)
        : undefined,
      dueDate: data.dueDate
        ? new Date(data.dueDate)
        : undefined,
    });

    await activityService.log({
      organizationId: user.organizationId!,
      actor: user.id,
      taskId: taskId,
      entity: "TASK",
      action: ActivityAction.TASK_UPDATED,
      newValue: data,
    });

    return updatedTask;
  }

  async assignTask(
    user: {
      id: string;
      organizationId: string | null;
    },
    taskId: string,
    body: AssignTaskInput
  ) {
    this.ensureOrganization(user);

    const data = assignTaskSchema.parse(body);

    const task =
      await this.getTaskOrThrow(taskId);

    this.ensureTaskAccess(
      task,
      user.organizationId!
    );

    const assignee =
      await userRepository.findById(
        data.assignee
      );

    if (!assignee) {
      throw new ApiError(
        HTTPSTATUS.NOT_FOUND,
        "Assignee not found"
      );
    }

    if (
      assignee.organizationId?.toString() !==
      user.organizationId
    ) {
      throw new ApiError(
        HTTPSTATUS.FORBIDDEN,
        "Assignee belongs to another organization"
      );
    }

    const assignedTask = await taskRepository.assignTask(
      taskId,
      new Types.ObjectId(data.assignee),
      new Types.ObjectId(user.id)
    );

    await activityService.log({
      organizationId: user.organizationId!,
      actor: user.id,
      taskId,
      entity: "TASK",
      action: ActivityAction.TASK_ASSIGNED,
      newValue: {
        assignee: data.assignee,
      },
    });

    return assignedTask;
  }

  async updateTaskStatus(
    user: {
      id: string;
      organizationId: string | null;
    },
    taskId: string,
    body: UpdateTaskStatusInput
  ) {
    this.ensureOrganization(user);

    const data =
      updateTaskStatusSchema.parse(body);

    const task =
      await this.getTaskOrThrow(taskId);

    this.ensureTaskAccess(
      task,
      user.organizationId!
    );

    const previousStatus = task.status;

    const allowedTransitions: Record<
      TaskStatus,
      TaskStatus[]
    > = {
      [TaskStatus.TODO]: [
        TaskStatus.IN_PROGRESS,
      ],
      [TaskStatus.IN_PROGRESS]: [
        TaskStatus.IN_REVIEW,
      ],
      [TaskStatus.IN_REVIEW]: [
        TaskStatus.DONE,
      ],
      [TaskStatus.DONE]: [],
    };

    if (
      !allowedTransitions[
        task.status as TaskStatus
      ].includes(data.status)
    ) {
      throw new ApiError(
        HTTPSTATUS.BAD_REQUEST,
        `Invalid status transition from ${task.status} to ${data.status}`
      );
    }

    const updatedTask = await taskRepository.updateTaskStatus(
      taskId,
      data.status,
      new Types.ObjectId(user.id)
    );

    await activityService.log({
      organizationId: user.organizationId!,
      actor: user.id,
      taskId,
      entity: "TASK",
      action: ActivityAction.TASK_STATUS_CHANGED,
      oldValue: previousStatus,
      newValue: data.status,
    });

    return updatedTask;
  }

  async deleteTask(
    user: {
      id: string;
      organizationId: string | null;
    },
    taskId: string
  ) {
    this.ensureOrganization(user);

    const task =
      await this.getTaskOrThrow(taskId);

    this.ensureTaskAccess(
      task,
      user.organizationId!
    );

    await taskRepository.softDeleteTask(
      taskId,
      new Types.ObjectId(user.id)
    );

    return;
  }
}

export const taskService =
  new TaskService();