import type { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export interface RequestWithId extends Request {
  requestId: string;
}

export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const incoming = req.header("x-request-id");
  const requestId =
    typeof incoming === "string" && incoming.trim().length > 0
      ? incoming.trim()
      : uuidv4();

  (req as RequestWithId).requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
}
