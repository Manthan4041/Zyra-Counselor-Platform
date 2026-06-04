import { Router } from "express";
import { updateTaskStatus } from "../services/actionCenter.js";
import type { TaskStatus } from "../types.js";
import { AppError } from "../middleware/errorHandler.js";

const VALID_STATUSES: TaskStatus[] = ["todo", "in_progress", "completed"];

export const tasksRouter = Router();

tasksRouter.patch("/:taskId/status", (req, res, next) => {
  try {
    const { status } = req.body as { status?: string };

    if (!status || !VALID_STATUSES.includes(status as TaskStatus)) {
      throw new AppError(
        400,
        `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
        "INVALID_STATUS"
      );
    }

    const updated = updateTaskStatus(req.params.taskId, status as TaskStatus);
    if (!updated) {
      throw new AppError(
        404,
        `Task ${req.params.taskId} not found`,
        "TASK_NOT_FOUND"
      );
    }

    res.json({ task: updated });
  } catch (err) {
    next(err);
  }
});
