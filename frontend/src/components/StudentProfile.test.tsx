import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StudentProfile } from "./StudentProfile";
import type { ActionCenterData } from "../types";

const mockData: ActionCenterData = {
  student: {
    id: "stu_001",
    name: "Maya Patel",
    email: "maya.patel@school.edu",
    grade: 11,
    gpa: 3.2,
    counselorId: "csl_001",
    enrollmentStatus: "at_risk",
  },
  tasks: [],
  unreadMessagesCount: 2,
  urgencyLevel: "critical",
  urgencyReasons: ["2 urgent open tasks", "Student marked at risk"],
  summary: {
    openTasks: 4,
    urgentOpenTasks: 2,
    overdueOpenTasks: 1,
    inProgressTasks: 1,
    completedTasks: 1,
  },
};

describe("StudentProfile", () => {
  it("renders student summary, unread count, and urgency badge", () => {
    render(<StudentProfile data={mockData} />);

    expect(screen.getByRole("heading", { name: "Maya Patel" })).toBeInTheDocument();
    expect(screen.getByText("maya.patel@school.edu")).toBeInTheDocument();
    expect(screen.getByTestId("unread-messages-count")).toHaveTextContent("2");
    expect(screen.getByText(/Urgency: critical/i)).toBeInTheDocument();
    expect(screen.getByText("At risk")).toBeInTheDocument();
    expect(screen.getByText("2 urgent open tasks")).toBeInTheDocument();
    expect(screen.getByText("Open tasks")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });
});
