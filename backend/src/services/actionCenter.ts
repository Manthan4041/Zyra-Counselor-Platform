import { messages, students, tasks } from "../data/mockData.js";
import type { ActionCenterResponse, Task, TaskStatus } from "../types.js";
import { computeUrgency, isOverdue } from "./urgency.js";

export function getActionCenter(studentId: string): ActionCenterResponse | null {
  const student = students.find((s) => s.id === studentId);
  if (!student) return null;

  const studentTasks = tasks
    .filter((t) => t.studentId === studentId)
    .sort((a, b) => {
      const priorityOrder: Record<Task["priority"], number> = {
        urgent: 0,
        high: 1,
        medium: 2,
        low: 3,
      };
      const statusOrder: Record<Task["status"], number> = {
        todo: 0,
        in_progress: 1,
        completed: 2,
      };
      const p =
        priorityOrder[a.priority] - priorityOrder[b.priority] ||
        statusOrder[a.status] - statusOrder[b.status];
      if (p !== 0) return p;
      return a.dueDate.localeCompare(b.dueDate);
    });

  const unreadMessagesCount = messages.filter(
    (m) => m.studentId === studentId && !m.read
  ).length;

  const openTasks = studentTasks.filter((t) => t.status !== "completed");
  const { level, reasons } = computeUrgency(
    student,
    openTasks,
    unreadMessagesCount
  );

  return {
    student,
    tasks: studentTasks,
    unreadMessagesCount,
    urgencyLevel: level,
    urgencyReasons: reasons,
    summary: {
      openTasks: openTasks.length,
      urgentOpenTasks: openTasks.filter((t) => t.priority === "urgent").length,
      overdueOpenTasks: openTasks.filter((t) =>
        isOverdue(t.dueDate, t.status)
      ).length,
      inProgressTasks: studentTasks.filter((t) => t.status === "in_progress")
        .length,
      completedTasks: studentTasks.filter((t) => t.status === "completed")
        .length,
    },
  };
}

export function updateTaskStatus(
  taskId: string,
  status: TaskStatus
): Task | null {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return null;

  task.status = status;
  task.updatedAt = new Date().toISOString();
  return { ...task };
}

export function listStudents() {
  return students.map(({ id, name, grade, enrollmentStatus }) => ({
    id,
    name,
    grade,
    enrollmentStatus,
  }));
}
