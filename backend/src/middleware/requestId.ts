import { randomUUID } from "crypto";
import { Request, Response, NextFunction } from "express";

export function requestId(
  req: Request,

  res: Response,

  next: NextFunction
) {
req.headers["x-request-id"] = randomUUID();
  next();
}