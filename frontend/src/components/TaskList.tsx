import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatus } from "../api/client";
import type { ActionCenterData, Task, TaskStatus } from "../types";
import { Badge } from "./ui/Badge";
import {
  isTaskOverdue,
  priorityBadgeClass,
  statusLabel,
} from "../lib/badges";

interface TaskListProps {
  studentId: string;
  tasks: Task[];
}

const STATUS_OPTIONS: TaskStatus[] = ["todo", "in_progress", "completed"];

export function TaskList({ studentId, tasks }: TaskListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      updateTaskStatus(taskId, status),
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({
        queryKey: ["action-center", studentId],
      });
      const previous = queryClient.getQueryData<ActionCenterData>([
        "action-center",
        studentId,
      ]);
      if (previous) {
        queryClient.setQueryData<ActionCenterData>(["action-center", studentId], {
          ...previous,
          tasks: previous.tasks.map((t) =>
            t.id === taskId ? { ...t, status } : t
          ),
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["action-center", studentId],
          context.previous
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["action-center", studentId] });
    },
  });

  if (tasks.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
        No tasks for this student.
      </p>
    );
  }

  return (
    <section aria-labelledby="task-list-heading">
      <h2 id="task-list-heading" className="mb-4 text-lg font-semibold text-zyra-900">
        Tasks
      </h2>
      <ul className="space-y-3" role="list">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-slate-900">{task.title}</h3>
                  <Badge className={priorityBadgeClass(task.priority)}>
                    {task.priority}
                  </Badge>
                  {isTaskOverdue(task) && (
                    <Badge className="bg-red-100 text-red-800 ring-red-200">
                      Overdue
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-600">{task.description}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Due {task.dueDate} · Updated{" "}
                  {new Date(task.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <label className="flex shrink-0 flex-col gap-1 text-xs text-slate-500">
                Status
                <select
                  value={task.status}
                  disabled={mutation.isPending}
                  onChange={(e) =>
                    mutation.mutate({
                      taskId: task.id,
                      status: e.target.value as TaskStatus,
                    })
                  }
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-zyra-600 disabled:opacity-50"
                  aria-label={`Update status for ${task.title}`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {statusLabel(s)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {mutation.isError && mutation.variables?.taskId === task.id && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                Failed to update task. Changes were reverted.
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
