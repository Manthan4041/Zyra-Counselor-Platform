import * as Select from "@radix-ui/react-select";
import { useQuery } from "@tanstack/react-query";
import { fetchStudents } from "../api/client";
import { useStudentStore } from "../store/studentStore";

export function StudentSelector() {
  const selectedStudentId = useStudentStore((s) => s.selectedStudentId);
  const setSelectedStudentId = useStudentStore((s) => s.setSelectedStudentId);

  const { data: students = [], isLoading, isError } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-200" aria-label="Loading students" />
    );
  }

  if (isError) {
    return <p className="text-sm text-red-600">Could not load student list</p>;
  }

  const selected = students.find((s) => s.id === selectedStudentId);

  return (
    <Select.Root value={selectedStudentId} onValueChange={setSelectedStudentId}>
      <Select.Trigger
        className="inline-flex h-10 min-w-[240px] items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-zyra-600"
        aria-label="Select student"
      >
        <Select.Value>
          {selected ? `${selected.name} (Grade ${selected.grade})` : "Select student"}
        </Select.Value>
        <Select.Icon className="text-slate-400">▾</Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className="z-50 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
          position="popper"
          sideOffset={4}
        >
          <Select.Viewport className="p-1">
            {students.map((student) => (
              <Select.Item
                key={student.id}
                value={student.id}
                className="relative flex cursor-pointer select-none items-center rounded-md px-8 py-2 text-sm outline-none data-[highlighted]:bg-zyra-50 data-[state=checked]:font-medium"
              >
                <Select.ItemText>
                  {student.name} — Grade {student.grade}
                  {student.enrollmentStatus === "at_risk" && (
                    <span className="ml-2 text-xs text-red-600">At risk</span>
                  )}
                </Select.ItemText>
                <Select.ItemIndicator className="absolute left-2">✓</Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
