import { FilterQuery, Types } from "mongoose";

import { HTTPSTATUS } from "../config/http.config";
import { ApiError } from "../errors/ApiError";
import {
  createProjectSchema,
  updateProjectSchema,
  CreateProjectInput,
  UpdateProjectInput,
} from "../validators/project.validator";

import { projectRepository } from "../repositories/project.repository";
import { IProject, ProjectStatus } from "../models/project.model";

class ProjectService {
  async createProject(
    user: {
      id: string;
      organizationId: string | null;
    },
    body: CreateProjectInput
  ) {
    const data = createProjectSchema.parse(body);

    if (!user.organizationId) {
      throw new ApiError(
        HTTPSTATUS.BAD_REQUEST,
        "User does not belong to an organization"
      );
    }

    const project = await projectRepository.createProject({
      name: data.name,
      description: data.description,
      organizationId: new Types.ObjectId(user.organizationId),
      owner: new Types.ObjectId(user.id),
      createdBy: new Types.ObjectId(user.id),
      status: ProjectStatus.ACTIVE,
    });

    return project;
  }

  async getAllProjects(
    user: {
      organizationId: string | null;
    },
    query: {
      page?: string;
      limit?: string;
      search?: string;
      sort?: string;
    }
  ) {
    if (!user.organizationId) {
      throw new ApiError(
        HTTPSTATUS.BAD_REQUEST,
        "User does not belong to an organization"
      );
    }

    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.max(Number(query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IProject> = {
      organizationId: new Types.ObjectId(user.organizationId),
      deletedAt: null,
    };

    if (query.search) {
      filter.name = {
        $regex: query.search,
        $options: "i",
      };
    }

    let sort: Record<string, 1 | -1> = {
      createdAt: -1,
    };

    if (query.sort) {
      const field = query.sort.startsWith("-")
        ? query.sort.substring(1)
        : query.sort;

      sort = {
        [field]: query.sort.startsWith("-") ? -1 : 1,
      };
    }

    const [projects, total] = await Promise.all([
      projectRepository.findAll(filter, skip, limit, sort),
      projectRepository.count(filter),
    ]);

    return {
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProjectById(
    user: {
      organizationId: string | null;
    },
    projectId: string
  ) {
    if (!user.organizationId) {
      throw new ApiError(
        HTTPSTATUS.BAD_REQUEST,
        "User does not belong to an organization"
      );
    }

    const project = await projectRepository.findById(projectId);

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
        "You do not have access to this project"
      );
    }

    return project;
  }

  async updateProject(
    user: {
      id: string;
      organizationId: string | null;
    },
    projectId: string,
    body: UpdateProjectInput
  ) {
    if (!user.organizationId) {
      throw new ApiError(
        HTTPSTATUS.BAD_REQUEST,
        "User does not belong to an organization"
      );
    }

    const data = updateProjectSchema.parse(body);

    const project = await projectRepository.findById(projectId);

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
        "You do not have access to this project"
      );
    }

    return projectRepository.updateProject(projectId, {
      ...data,
      updatedBy: new Types.ObjectId(user.id),
    });
  }
  async archiveProject(
  user: {
    id: string;
    organizationId: string | null;
  },
  projectId: string
) {
  if (!user.organizationId) {
    throw new ApiError(
      HTTPSTATUS.BAD_REQUEST,
      "User does not belong to an organization"
    );
  }

  const project = await projectRepository.findById(projectId);

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
      "You do not have access to this project"
    );
  }

  if (project.status === ProjectStatus.ARCHIVED) {
    throw new ApiError(
      HTTPSTATUS.BAD_REQUEST,
      "Project is already archived"
    );
  }

  return projectRepository.archiveProject(projectId, {
    status: ProjectStatus.ARCHIVED,
    updatedBy: new Types.ObjectId(user.id),
  });
}
async deleteProject(
  user: {
    id: string;
    organizationId: string | null;
  },
  projectId: string
) {
  if (!user.organizationId) {
    throw new ApiError(
      HTTPSTATUS.BAD_REQUEST,
      "User does not belong to an organization"
    );
  }

  const project = await projectRepository.findById(projectId);

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
      "You do not have access to this project"
    );
  }

  return projectRepository.softDeleteProject(projectId, {
    deletedAt: new Date(),
    updatedBy: new Types.ObjectId(user.id),
  });
}
}

export const projectService = new ProjectService();