export type TaskStatus = "todo" | "in_progress" | "completed";
export type TaskPriority = "urgent" | "high" | "medium" | "low";
export type UrgencyLevel = "critical" | "high" | "medium" | "low";

export interface Student {
  id: string;
  name: string;
  email: string;
  grade: number;
  gpa: number;
  counselorId: string;
  enrollmentStatus: "active" | "at_risk";
}

export interface Task {
  id: string;
  studentId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActionCenterData {
  student: Student;
  tasks: Task[];
  unreadMessagesCount: number;
  urgencyLevel: UrgencyLevel;
  urgencyReasons: string[];
  summary: {
    openTasks: number;
    urgentOpenTasks: number;
    overdueOpenTasks: number;
    inProgressTasks: number;
    completedTasks: number;
  };
}

export interface StudentListItem {
  id: string;
  name: string;
  grade: number;
  enrollmentStatus: "active" | "at_risk";
}

export interface ApiError {
  error: {
    message: string;
    code: string;
    requestId: string;
  };
}
