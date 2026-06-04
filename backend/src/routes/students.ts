import { Router } from "express";
import { getActionCenter, listStudents } from "../services/actionCenter.js";
import { AppError } from "../middleware/errorHandler.js";

export const studentsRouter = Router();

studentsRouter.get("/", (_req, res) => {
  res.json({ students: listStudents() });
});

studentsRouter.get("/:id/action-center", (req, res, next) => {
  try {
    const data = getActionCenter(req.params.id);
    if (!data) {
      throw new AppError(404, `Student ${req.params.id} not found`, "STUDENT_NOT_FOUND");
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
});
