import { Request, Response, NextFunction } from "express";

import { redisService } from "../cache/redis.service";
import { HTTPSTATUS } from "../config/http.config";

export const rateLimit = (
  maxRequests: number = 5,
  windowSeconds: number = 60
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const redis =
        redisService.getClient();

      const ip =
        req.ip ||
        req.socket.remoteAddress ||
        "unknown";

      const key =
        `rate-limit:${req.path}:${ip}`;

      const current =
        await redis.incr(key);

      if (current === 1) {
        await redis.expire(
          key,
          windowSeconds
        );
      }

      res.setHeader(
        "X-RateLimit-Limit",
        maxRequests
      );

      res.setHeader(
        "X-RateLimit-Remaining",
        Math.max(
          maxRequests - current,
          0
        )
      );

      if (current > maxRequests) {
        return res.status(
          HTTPSTATUS.TOO_MANY_REQUESTS
        ).json({
          success: false,
          message:
            "Too many requests. Please try again later.",
          data: null,
        });
      }

      next();
    } catch (error) {
      // Redis failure should not take down
      // the authentication endpoint.
      console.error(
        "Rate limiter error:",
        error
      );

      next();
    }
  };
};