import { useQuery } from "@tanstack/react-query";
import { fetchActionCenter } from "../api/client";
import { useStudentStore } from "../store/studentStore";
import { StudentProfile } from "./StudentProfile";
import { TaskList } from "./TaskList";

function LoadingSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading action center">
      <div className="h-48 animate-pulse rounded-xl bg-slate-200" />
      <div className="h-64 animate-pulse rounded-xl bg-slate-200" />
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      className="rounded-xl border border-red-200 bg-red-50 p-6 text-center"
      role="alert"
    >
      <p className="font-medium text-red-800">Could not load action center</p>
      <p className="mt-1 text-sm text-red-700">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Try again
      </button>
    </div>
  );
}

export function ActionCenter() {
  const studentId = useStudentStore((s) => s.selectedStudentId);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["action-center", studentId],
    queryFn: () => fetchActionCenter(studentId),
    enabled: Boolean(studentId),
  });

  if (isLoading) return <LoadingSkeleton />;
  if (isError) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : "Unknown error"}
        onRetry={() => refetch()}
      />
    );
  }
  if (!data) return null;

  return (
    <div className="space-y-6">
      {isFetching && !isLoading && (
        <p className="text-xs text-slate-500" aria-live="polite">
          Refreshing…
        </p>
      )}
      <StudentProfile data={data} />
      <TaskList studentId={studentId} tasks={data.tasks} />
    </div>
  );
}
