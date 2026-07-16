import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

import { ApiError } from "../errors/ApiError";
import { errorResponse } from "../responses/apiResponse";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json(
      errorResponse(err.message)
    );
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues
    });

    return;
  }

  res.status(500).json(
    errorResponse("Internal Server Error")
  );
};