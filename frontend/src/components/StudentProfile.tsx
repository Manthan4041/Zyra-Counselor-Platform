import type { ActionCenterData } from "../types";
import { Badge } from "./ui/Badge";
import { urgencyBadgeClass } from "../lib/badges";

interface StudentProfileProps {
  data: ActionCenterData;
}

export function StudentProfile({ data }: StudentProfileProps) {
  const { student, unreadMessagesCount, urgencyLevel, urgencyReasons, summary } =
    data;

  return (
    <section
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-labelledby="student-profile-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="student-profile-heading" className="text-xl font-semibold text-zyra-900">
            {student.name}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{student.email}</p>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-slate-500">Grade</dt>
              <dd className="font-medium">{student.grade}</dd>
            </div>
            <div>
              <dt className="text-slate-500">GPA</dt>
              <dd className="font-medium">{student.gpa.toFixed(1)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Enrollment</dt>
              <dd className="font-medium capitalize">
                {student.enrollmentStatus.replace("_", " ")}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Unread messages</dt>
              <dd className="font-medium" data-testid="unread-messages-count">
                {unreadMessagesCount}
                {unreadMessagesCount > 0 && (
                  <span className="ml-1 inline-block h-2 w-2 rounded-full bg-red-500" aria-hidden />
                )}
              </dd>
            </div>
          </dl>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge className={urgencyBadgeClass(urgencyLevel)}>
            Urgency: {urgencyLevel}
          </Badge>
          {student.enrollmentStatus === "at_risk" && (
            <Badge className="bg-red-50 text-red-700 ring-red-100">At risk</Badge>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {urgencyReasons.map((reason) => (
          <span
            key={reason}
            className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700"
          >
            {reason}
          </span>
        ))}
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5" role="list">
        {[
          { label: "Open tasks", value: summary.openTasks },
          { label: "Urgent open", value: summary.urgentOpenTasks },
          { label: "Overdue open", value: summary.overdueOpenTasks },
          { label: "In progress", value: summary.inProgressTasks },
          { label: "Completed", value: summary.completedTasks },
        ].map((item) => (
          <li
            key={item.label}
            className="rounded-lg bg-zyra-50 px-3 py-2 text-center"
          >
            <p className="text-lg font-semibold text-zyra-700">{item.value}</p>
            <p className="text-xs text-slate-600">{item.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
