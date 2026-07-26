import { Request, Response } from "express";

import { asyncHandler } from "../middleware/asyncHandler";
import { successResponse } from "../responses/apiResponse";

import { projectService } from "../services/project.service";

class ProjectController {
  createProject = asyncHandler(
    async (req: Request, res: Response) => {
      const project = await projectService.createProject(
        req.user,
        req.body
      );

      return res.status(201).json(
        successResponse(
          project,
          "Project created successfully"
        )
      );
    }
  );

  getAllProjects = asyncHandler(
    async (req: Request, res: Response) => {
      const result = await projectService.getAllProjects(
        {
          organizationId: req.user.organizationId,
        },
        req.query as {
          page?: string;
          limit?: string;
          search?: string;
          sort?: string;
        }
      );

      return res.status(200).json(
        successResponse(
          result,
          "Projects fetched successfully"
        )
      );
    }
  );

  getProjectById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const project = await projectService.getProjectById(
      {
        organizationId: req.user.organizationId,
      },
      id
    );
    return res.status(200).json(
      successResponse(
        project,
        "Project fetched successfully"
      )
    );
  }
);
updateProject = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const project = await projectService.updateProject(
      {
        id: req.user.id,
        organizationId: req.user.organizationId,
      },
      id,
      req.body
    );

    return res.status(200).json(
      successResponse(
        project,
        "Project updated successfully"
      )
    );
  }
);
archiveProject = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const project = await projectService.archiveProject(
      {
        id: req.user.id,
        organizationId: req.user.organizationId,
      },
      id
    );

    return res.status(200).json(
      successResponse(
        project,
        "Project archived successfully"
      )
    );
  }
);
deleteProject = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await projectService.deleteProject(
      {
        id: req.user.id,
        organizationId: req.user.organizationId,
      },
      id
    );

    return res.status(200).json(
      successResponse(
        null,
        "Project deleted successfully"
      )
    );
  }
);

}

export const projectController = new ProjectController();