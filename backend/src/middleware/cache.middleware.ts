import { Request, Response, NextFunction } from "express";

import { cacheService } from "../cache/cache.service";

export const cacheMiddleware = (
  keyGenerator: (req: Request) => string,
  ttl: number
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const key = keyGenerator(req);

      const cachedData =
        await cacheService.get(key);

      if (cachedData !== null) {
        return res.status(200).json(cachedData);
      }

      // Save original res.json
      const originalJson = res.json.bind(res);

      // Override res.json
      res.json = ((body: unknown) => {
        cacheService
          .set(key, body, ttl)
          .catch((error) => {
            console.error(
              "Cache SET failed:",
              error
            );
          });

        return originalJson(body);
      }) as Response["json"];

      next();
    } catch (error) {
      console.error(
        "Cache middleware error:",
        error
      );

      // Redis failure should NOT break the API.
      next();
    }
  };
};