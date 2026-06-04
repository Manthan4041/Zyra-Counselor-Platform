import type { NextFunction, Request, Response } from "express";
import type { RequestWithId } from "./requestId.js";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function notFoundHandler(req: Request, res: Response): void {
  const requestId = (req as RequestWithId).requestId ?? "unknown";
  res.status(404).json({
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      code: "NOT_FOUND",
      requestId,
    },
  });
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const requestId = (req as RequestWithId).requestId ?? "unknown";

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code ?? "APP_ERROR",
        requestId,
      },
    });
    return;
  }

  console.error(
    JSON.stringify({
      level: "error",
      type: "unhandled",
      requestId,
      message: err instanceof Error ? err.message : "Unknown error",
      stack: err instanceof Error ? err.stack : undefined,
      timestamp: new Date().toISOString(),
    })
  );

  res.status(500).json({
    error: {
      message: "Internal server error",
      code: "INTERNAL_ERROR",
      requestId,
    },
  });
}
