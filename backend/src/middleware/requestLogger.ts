import type { NextFunction, Request, Response } from "express";
import type { RequestWithId } from "./requestId.js";

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();
  const requestId = (req as RequestWithId).requestId ?? "unknown";

  res.on("finish", () => {
    const durationMs = Date.now() - start;
    const log = {
      level: "info",
      type: "http",
      requestId,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs,
      timestamp: new Date().toISOString(),
    };
    console.log(JSON.stringify(log));
  });

  next();
}
