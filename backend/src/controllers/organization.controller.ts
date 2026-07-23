import { Request, Response } from "express";

import { successResponse } from "../responses/apiResponse";
import { asyncHandler } from "../middleware/asyncHandler";

import { organizationService } from "../services/organization.service";

class OrganizationController {
  createOrganization = asyncHandler(
    async (req: Request, res: Response) => {
      const organization =
        await organizationService.createOrganization(
          req.user.id,
          req.body
        );

      return res.status(201).json(
        successResponse(
          organization,
          "Organization created successfully"
        )
      );
    }
  );
}

export const organizationController =
  new OrganizationController();