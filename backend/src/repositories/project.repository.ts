import { FilterQuery } from "mongoose";

import {
  IProject,
  Project,
  ProjectStatus,
} from "../models/project.model";

class ProjectRepository {
  async createProject(data: Partial<IProject>) {
    return Project.create(data);
  }

  async findById(id: string) {
    return Project.findOne({
      _id: id,
      deletedAt: null,
    });
  }

  async findAll(
    filter: FilterQuery<IProject>,
    skip: number,
    limit: number,
    sort: Record<string, 1 | -1>
  ) {
    return Project.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async count(filter: FilterQuery<IProject>) {
    return Project.countDocuments(filter);
  }

  async updateProject(
    id: string,
    data: Partial<IProject>
  ) {
    return Project.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
      }
    );
  }

  async archiveProject(id: string) {
    return Project.findByIdAndUpdate(
      id,
      {
        status: ProjectStatus.ARCHIVED,
      },
      {
        new: true,
      }
    );
  }

  async softDeleteProject(id: string) {
    return Project.findByIdAndUpdate(
      id,
      {
        deletedAt: new Date(),
      },
      {
        new: true,
      }
    );
  }
}

export const projectRepository = new ProjectRepository();