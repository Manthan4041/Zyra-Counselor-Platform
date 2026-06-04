export type TaskStatus = "todo" | "in_progress" | "completed";
export type TaskPriority = "urgent" | "high" | "medium" | "low";
export type EnrollmentStatus = "active" | "at_risk";
export type UrgencyLevel = "critical" | "high" | "medium" | "low";

export interface Student {
  id: string;
  name: string;
  email: string;
  grade: number;
  gpa: number;
  counselorId: string;
  enrollmentStatus: EnrollmentStatus;
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

export interface Message {
  id: string;
  studentId: string;
  from: string;
  subject: string;
  preview: string;
  read: boolean;
  receivedAt: string;
}

export interface ActionCenterResponse {
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
