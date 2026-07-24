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
  inviteMember = asyncHandler(
  async (req: Request, res: Response) => {
    const result =
      await organizationService.inviteMember(
        req.user.organizationId!,
        req.body
      );

    return res.status(200).json(
      successResponse(
        result,
        "Member invited successfully"
      )
    );
  }
);
}

export const organizationController =
  new OrganizationController();