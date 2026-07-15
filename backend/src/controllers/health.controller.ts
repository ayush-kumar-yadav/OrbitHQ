import { Request, Response } from "express";

import { successResponse } from "../responses/apiResponse";

export const healthController = (
  req: Request,
  res: Response
) => {
  res.json(
    successResponse(
      {
        version: "v1"
      },
      "OrbitHQ API Running"
    )
  );
};