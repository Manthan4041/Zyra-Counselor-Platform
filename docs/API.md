# API Contract — Counselor Student Action Center

Base URL (local): `http://localhost:3001`  
Frontend dev proxy: `/api` → backend root

All responses include header `X-Request-Id` (UUID). Error bodies include the same id in `error.requestId`.

---

## `GET /health`

**Response `200`**

```json
{ "status": "ok" }
```

---

## `GET /students`

Lists students for the counselor student picker.

**Response `200`**

```json
{
  "students": [
    {
      "id": "stu_001",
      "name": "Maya Patel",
      "grade": 11,
      "enrollmentStatus": "at_risk"
    }
  ]
}
```

---

## `GET /students/:id/action-center`

Returns the aggregated counselor view for one student.

**Response `200`**

```json
{
  "student": {
    "id": "stu_001",
    "name": "Maya Patel",
    "email": "maya.patel@school.edu",
    "grade": 11,
    "gpa": 3.2,
    "counselorId": "csl_001",
    "enrollmentStatus": "at_risk"
  },
  "tasks": [ /* Task[], sorted by priority then status then due date */ ],
  "unreadMessagesCount": 2,
  "urgencyLevel": "critical",
  "urgencyReasons": ["2 urgent open tasks", "1 overdue open task", "Student marked at risk", "2 unread messages"],
  "summary": {
    "openTasks": 4,
    "urgentOpenTasks": 2,
    "overdueOpenTasks": 1,
    "inProgressTasks": 1,
    "completedTasks": 1
  }
}
```

**Response `404`**

```json
{
  "error": {
    "message": "Student stu_999 not found",
    "code": "STUDENT_NOT_FOUND",
    "requestId": "..."
  }
}
```

### Urgency levels

Computed server-side from open tasks, enrollment status, and unread messages (reference date `2026-06-04` for overdue checks):

| Level    | Typical signals                                      |
|----------|------------------------------------------------------|
| critical | Multiple urgent/overdue open tasks + at-risk + unread |
| high     | Strong combination of the above                      |
| medium   | Some escalation signals                              |
| low      | No immediate escalation                              |

---

## `PATCH /tasks/:taskId/status`

Updates a task status in the in-memory mock store.

**Request body**

```json
{ "status": "in_progress" }
```

Allowed values: `todo` | `in_progress` | `completed`

**Response `200`**

```json
{
  "task": {
    "id": "tsk_001",
    "studentId": "stu_001",
    "title": "Submit FAFSA application",
    "status": "in_progress",
    "updatedAt": "2026-06-04T12:00:00.000Z"
  }
}
```

**Response `400`** — invalid status (`INVALID_STATUS`)  
**Response `404`** — unknown task (`TASK_NOT_FOUND`)
