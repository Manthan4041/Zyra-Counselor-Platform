import type { ActionCenterData, ApiError, StudentListItem, Task, TaskStatus } from "../types";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T | ApiError;
  if (!res.ok) {
    const err = data as ApiError;
    throw new Error(err.error?.message ?? `Request failed (${res.status})`);
  }
  return data as T;
}

export async function fetchStudents(): Promise<StudentListItem[]> {
  const res = await fetch(`${API_BASE}/students`);
  const data = await parseJson<{ students: StudentListItem[] }>(res);
  return data.students;
}

export async function fetchActionCenter(studentId: string): Promise<ActionCenterData> {
  const res = await fetch(`${API_BASE}/students/${studentId}/action-center`);
  return parseJson<ActionCenterData>(res);
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus
): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${taskId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const data = await parseJson<{ task: Task }>(res);
  return data.task;
}
