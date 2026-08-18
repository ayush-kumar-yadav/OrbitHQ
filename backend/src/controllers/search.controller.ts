import { Request, Response } from "express";

import { asyncHandler } from "../middleware/asyncHandler";
import { successResponse } from "../responses/apiResponse";

import { searchService } from "../services/search.service";

class SearchController {
  globalSearch = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user.id;

      const organizationId =
        req.user.organizationId;

      if (!organizationId) {
        return res.status(400).json(
          successResponse(
            null,
            "User does not belong to an organization"
          )
        );
      }

      const query =
        typeof req.query.q === "string"
          ? req.query.q
          : "";

      const limit =
        typeof req.query.limit === "string"
          ? Number(req.query.limit)
          : 5;

      const result =
        await searchService.globalSearch(
          organizationId,
          query,
          limit
        );

      return res.status(200).json(
        successResponse(
          result,
          "Global search completed successfully"
        )
      );
    }
  );
}

export const searchController =
  new SearchController();