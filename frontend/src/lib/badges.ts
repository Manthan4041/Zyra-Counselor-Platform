import type { Task, TaskPriority, TaskStatus, UrgencyLevel } from "../types";

export function urgencyBadgeClass(level: UrgencyLevel): string {
  const map: Record<UrgencyLevel, string> = {
    critical: "bg-red-100 text-red-800 ring-red-200",
    high: "bg-orange-100 text-orange-800 ring-orange-200",
    medium: "bg-amber-100 text-amber-800 ring-amber-200",
    low: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  };
  return map[level];
}

export function priorityBadgeClass(priority: TaskPriority): string {
  const map: Record<TaskPriority, string> = {
    urgent: "bg-red-50 text-red-700",
    high: "bg-orange-50 text-orange-700",
    medium: "bg-slate-100 text-slate-700",
    low: "bg-slate-50 text-slate-500",
  };
  return map[priority];
}

export function statusLabel(status: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    todo: "To do",
    in_progress: "In progress",
    completed: "Completed",
  };
  return map[status];
}

export function isTaskOverdue(task: Task): boolean {
  if (task.status === "completed") return false;
  const due = new Date(`${task.dueDate}T23:59:59Z`);
  const ref = new Date("2026-06-04T00:00:00Z");
  return due < ref;
}
