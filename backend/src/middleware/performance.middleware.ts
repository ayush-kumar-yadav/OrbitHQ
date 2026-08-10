import { Request, Response, NextFunction } from "express";

export const performanceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const end = process.hrtime.bigint();

    const durationMs =
      Number(end - start) / 1_000_000;

    const duration =
      durationMs.toFixed(2);

    if (durationMs >= 100) {
      console.log(
        `🐌 SLOW REQUEST: ${req.method} ${req.originalUrl} - ${duration}ms`
      );
    } else {
      console.log(
        `⚡ REQUEST: ${req.method} ${req.originalUrl} - ${duration}ms`
      );
    }
  });

  next();
};