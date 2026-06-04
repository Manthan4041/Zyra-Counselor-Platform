# Architecture — Counselor Student Action Center

## Overview

Monorepo with two packages:

- **`backend/`** — Express + TypeScript API, in-memory mock data
- **`frontend/`** — Vite + React + TypeScript SPA

```
Manthan_asignment/
├── backend/src/
│   ├── data/mockData.ts      # Exact assessment mock data
│   ├── services/             # Domain logic (aggregation, urgency, mutations)
│   ├── routes/               # HTTP adapters
│   ├── middleware/           # Request ID, logging, errors
│   └── app.ts                # App factory (shared by server + tests)
├── frontend/src/
│   ├── api/                  # Fetch client + error parsing
│   ├── store/                # Zustand — selected student only
│   ├── components/           # UI sections
│   └── lib/                  # Badge / overdue helpers (mirrors server rules)
└── docs/                     # API contract, CI log, architecture
```

## Backend layering

1. **Routes** validate HTTP input and map status codes.
2. **Services** own business rules:
   - `getActionCenter` joins student, tasks, messages; sorts tasks; builds summary.
   - `computeUrgency` scores open tasks, overdue (vs fixed reference date), enrollment, unread count.
   - `updateTaskStatus` mutates the shared in-memory `tasks` array (acceptable for mock/assessment).
3. **Middleware** (production-oriented, Task 2):
   - `requestIdMiddleware` — accepts `X-Request-Id` or generates UUID; echoes on response.
   - `requestLogger` — structured JSON logs on `finish` (method, path, status, duration).
   - `errorHandler` — consistent `{ error: { message, code, requestId } }` shape.

`createApp()` is exported so integration tests hit the real stack without binding a port.

## Frontend data flow

| Concern              | Tool              | Responsibility                          |
|----------------------|-------------------|-----------------------------------------|
| Selected student     | Zustand           | `selectedStudentId` across header + main |
| Action center data   | TanStack Query    | Fetch, cache, loading/error, refetch    |
| Task status updates  | `useMutation`     | Optimistic cache update + rollback      |

Vite proxies `/api` → `localhost:3001` in development so the UI uses relative URLs and avoids CORS setup.

## UI composition

- **StudentSelector** — Radix Select, accessible keyboard navigation
- **StudentProfile** — profile, unread count, urgency badge + reasons, summary tiles
- **TaskList** — priority/overdue badges, status `<select>` per task
- **ActionCenter** — orchestrates loading skeleton and error retry

## Key design choices

- **Single action-center endpoint** keeps the counselor view one round-trip; task PATCH is separate for clear mutation semantics.
- **Server-side urgency** ensures counselors see consistent priority logic; the frontend only displays `urgencyLevel` and reasons.
- **Optimistic updates** make status changes feel instant while `invalidateQueries` reconciles summary/urgency after PATCH.

## Extension path (real Zyra platform)

Replace `mockData.ts` with MongoDB repositories, add auth middleware on routes, push urgency recompute to a worker or DB view, and add SSE for live message counts — without changing the frontend contract.
