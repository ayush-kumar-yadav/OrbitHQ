import { FilterQuery, SortOrder, Types } from "mongoose";

import { ITask, Task } from "../models/task.model";

class TaskRepository {
  async createTask(task: Partial<ITask>) {
    return Task.create(task);
  }

  async findTaskById(taskId: string) {
    return Task.findOne({
      _id: taskId,
      deletedAt: null,
    })
      .populate("assignee", "name email")
      .populate("reporter", "name email")
      .populate("projectId", "name status")
      .lean();
  }

  async findTasks(
    filter: FilterQuery<ITask>,
    options: {
      skip: number;
      limit: number;
      sort: Record<string, SortOrder>;
    }
  ) {
    return Task.find(filter)
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit)
      .populate("assignee", "name email")
      .populate("reporter", "name email")
      .populate("projectId", "name status")
      .lean();
  }

  async count(filter: FilterQuery<ITask>) {
    return Task.countDocuments(filter);
  }

  async updateTask(
    taskId: string,
    data: Partial<ITask>
  ) {
    return Task.findByIdAndUpdate(
      taskId,
      data,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("assignee", "name email")
      .populate("reporter", "name email")
      .populate("projectId", "name status")
      .lean();
  }

  async assignTask(
    taskId: string,
    assignee: Types.ObjectId,
    updatedBy: Types.ObjectId
  ) {
    return Task.findByIdAndUpdate(
      taskId,
      {
        assignee,
        updatedBy,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("assignee", "name email")
      .populate("reporter", "name email")
      .populate("projectId", "name status")
      .lean();
  }

  async updateTaskStatus(
    taskId: string,
    status: ITask["status"],
    updatedBy: Types.ObjectId
  ) {
    return Task.findByIdAndUpdate(
      taskId,
      {
        status,
        updatedBy,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("assignee", "name email")
      .populate("reporter", "name email")
      .populate("projectId", "name status")
      .lean();
  }

  async softDeleteTask(
    taskId: string,
    updatedBy: Types.ObjectId
  ) {
    return Task.findByIdAndUpdate(
      taskId,
      {
        deletedAt: new Date(),
        updatedBy,
      },
      {
        new: true,
      }
    );
  }
}

export const taskRepository = new TaskRepository();