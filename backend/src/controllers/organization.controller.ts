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

  getMyOrganization = asyncHandler(
    async (req: Request, res: Response) => {
      const organization =
        await organizationService.getMyOrganization({
          organizationId: req.user.organizationId,
        });

      return res.status(200).json(
        successResponse(
          organization,
          "Organization fetched successfully"
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

  getMembers = asyncHandler(
    async (req: Request, res: Response) => {
      const members =
        await organizationService.getMembers(
          req.user.organizationId!
        );

      return res.status(200).json(
        successResponse(
          members,
          "Members fetched successfully"
        )
      );
    }
  );

  updateMemberRole = asyncHandler(
    async (req: Request, res: Response) => {
      const member =
       await organizationService.updateMemberRole(
  req.user.organizationId!,
  req.params.userId as string,
  req.body.role
); 

      return res.status(200).json(
        successResponse(
          member,
          "Role updated successfully"
        )
      );
    }
  );

  removeMember = asyncHandler(
    async (req: Request, res: Response) => {
      await organizationService.removeMember(
  req.user.organizationId!,
  req.params.userId as string
);

      return res.status(200).json(
        successResponse(
          null,
          "Member removed successfully"
        )
      );
    }
  );
}

export const organizationController =
  new OrganizationController();