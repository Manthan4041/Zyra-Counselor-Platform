import type { Student, Task, UrgencyLevel } from "../types.js";

const REFERENCE_DATE = new Date("2026-06-04T00:00:00Z");

export function isOverdue(dueDate: string, status: Task["status"]): boolean {
  if (status === "completed") return false;
  const due = new Date(`${dueDate}T23:59:59Z`);
  return due < REFERENCE_DATE;
}

export function computeUrgency(
  student: Student,
  openTasks: Task[],
  unreadCount: number
): { level: UrgencyLevel; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  const urgentOpen = openTasks.filter((t) => t.priority === "urgent");
  const overdueOpen = openTasks.filter((t) => isOverdue(t.dueDate, t.status));

  if (urgentOpen.length > 0) {
    score += 3;
    reasons.push(
      `${urgentOpen.length} urgent open task${urgentOpen.length > 1 ? "s" : ""}`
    );
  }

  if (overdueOpen.length > 0) {
    score += 3;
    reasons.push(
      `${overdueOpen.length} overdue open task${overdueOpen.length > 1 ? "s" : ""}`
    );
  }

  if (student.enrollmentStatus === "at_risk") {
    score += 2;
    reasons.push("Student marked at risk");
  }

  if (unreadCount >= 2) {
    score += 2;
    reasons.push(`${unreadCount} unread messages`);
  } else if (unreadCount === 1) {
    score += 1;
    reasons.push("1 unread message");
  }

  const highPriorityOpen = openTasks.filter((t) => t.priority === "high");
  if (highPriorityOpen.length >= 2) {
    score += 1;
    reasons.push("Multiple high-priority open tasks");
  }

  let level: UrgencyLevel;
  if (score >= 6) level = "critical";
  else if (score >= 4) level = "high";
  else if (score >= 2) level = "medium";
  else level = "low";

  if (reasons.length === 0) {
    reasons.push("No immediate escalation signals");
  }

  return { level, reasons };
}
