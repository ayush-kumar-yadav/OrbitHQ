import { Types } from "mongoose";

import { Project } from "../models/project.model";
import { Task } from "../models/task.model";
import { User } from "../models/user.model";
import { Comment } from "../models/comment.model";

class SearchRepository {
  async searchProjects(
    organizationId: string,
    query: string,
    limit: number
  ) {
    const organizationObjectId =
      new Types.ObjectId(organizationId);

    const regex = new RegExp(
      this.escapeRegex(query),
      "i"
    );

    return Project.find({
      organizationId: organizationObjectId,
      deletedAt: null,
      $or: [
        { name: regex },
        { description: regex },
      ],
    })
      .select("_id name description status")
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();
  }

  async searchTasks(
    organizationId: string,
    query: string,
    limit: number
  ) {
    const organizationObjectId =
      new Types.ObjectId(organizationId);

    const regex = new RegExp(
      this.escapeRegex(query),
      "i"
    );

    return Task.find({
      organizationId: organizationObjectId,
      deletedAt: null,
      $or: [
        { title: regex },
        { description: regex },
      ],
    })
      .select(
        "_id title description status priority projectId assignee"
      )
      .populate(
        "projectId",
        "_id name"
      )
      .populate(
        "assignee",
        "_id name email"
      )
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();
  }

  async searchUsers(
    organizationId: string,
    query: string,
    limit: number
  ) {
    const organizationObjectId =
      new Types.ObjectId(organizationId);

    const regex = new RegExp(
      this.escapeRegex(query),
      "i"
    );

    return User.find({
      organizationId: organizationObjectId,
      $or: [
        { name: regex },
        { email: regex },
      ],
    })
      .select("_id name email role")
      .sort({ name: 1 })
      .limit(limit)
      .lean();
  }

  async searchComments(
    organizationId: string,
    query: string,
    limit: number
  ) {
    const organizationObjectId =
      new Types.ObjectId(organizationId);

    const regex = new RegExp(
      this.escapeRegex(query),
      "i"
    );

    return Comment.find({
      organizationId: organizationObjectId,
      deletedAt: null,
      content: regex,
    })
      .select(
        "_id content taskId author createdAt"
      )
      .populate(
        "taskId",
        "_id title"
      )
      .populate(
        "author",
        "_id name email"
      )
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  private escapeRegex(value: string) {
    return value.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
  }
}

export const searchRepository =
  new SearchRepository();