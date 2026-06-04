# Zyra — Counselor Student Action Center

A full-stack web application that provides school counselors with a centralised dashboard to monitor student status, manage tasks, and track urgency levels.

Built as a monorepo with a **backend API** (Express + TypeScript) and a **frontend SPA** (React + Vite + TypeScript).

---

## Tech Stack

| Layer      | Technology                                      |
|------------|--------------------------------------------------|
| Backend    | Node.js, Express 4, TypeScript, UUID             |
| Frontend   | React 19, Vite, TypeScript, TailwindCSS 4        |
| State      | Zustand (client), TanStack Query (server state)  |
| UI         | Radix UI (Select), custom Badge component        |
| Testing    | Vitest, Supertest (API), Testing Library (React)  |
| CI         | GitHub Actions                                   |

---

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9

---

## Getting Started

### 1. Install dependencies

```bash
npm run install:all
```

This installs dependencies for both `backend/` and `frontend/`.

### 2. Start the backend API

```bash
npm run dev:api
```

The API server starts at **http://localhost:3001**.

### 3. Start the frontend dev server

```bash
npm run dev:web
```

The frontend starts at **http://localhost:5173**. API requests are proxied from `/api` to `localhost:3001` automatically.

### 4. Open the app

Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Endpoints

| Method  | Path                              | Description                        |
|---------|------------------------------------|------------------------------------|
| `GET`   | `/health`                         | Health check                       |
| `GET`   | `/students`                       | List all students (for selector)   |
| `GET`   | `/students/:id/action-center`     | Aggregated counselor view          |
| `PATCH` | `/tasks/:taskId/status`           | Update task status                 |

All responses include an `X-Request-Id` header. See [docs/API.md](docs/API.md) for the full contract and response schemas.

---

## Project Structure

```
Zyra-Counselor-Platform/
├── backend/
│   └── src/
│       ├── data/mockData.ts          # In-memory mock student/task/message data
│       ├── services/
│       │   ├── actionCenter.ts       # Aggregation, task mutations, student listing
│       │   └── urgency.ts            # Urgency scoring algorithm
│       ├── routes/
│       │   ├── students.ts           # Student and action center endpoints
│       │   └── tasks.ts              # Task status update endpoint
│       ├── middleware/
│       │   ├── requestId.ts          # X-Request-Id generation/passthrough
│       │   ├── requestLogger.ts      # Structured JSON request logging
│       │   └── errorHandler.ts       # Consistent error response shape
│       ├── types.ts                  # Shared TypeScript interfaces
│       ├── app.ts                    # Express app factory
│       └── index.ts                  # Server entry point
├── frontend/
│   └── src/
│       ├── api/client.ts             # Fetch client with error parsing
│       ├── store/studentStore.ts     # Zustand store for selected student
│       ├── components/
│       │   ├── ActionCenter.tsx      # Main orchestrator (loading, error, data)
│       │   ├── StudentSelector.tsx   # Radix Select dropdown
│       │   ├── StudentProfile.tsx    # Profile card, urgency badge, summary
│       │   ├── TaskList.tsx          # Task cards with status mutation
│       │   └── ui/Badge.tsx          # Reusable badge component
│       ├── lib/badges.ts            # Badge styling and overdue helpers
│       └── types.ts                  # Frontend TypeScript interfaces
├── docs/
│   ├── API.md                        # Full API contract documentation
│   ├── ARCHITECTURE.md               # Architecture and design decisions
│   └── ci-test-output.txt            # CI test run output
└── package.json                      # Root workspace scripts
```

---

## Testing

Run all tests (backend + frontend):

```bash
npm test
```

Run tests individually:

```bash
# Backend integration tests
npm run test --prefix backend

# Frontend component tests
npm run test:watch --prefix frontend
```

### Test Coverage

- **Backend** — 4 integration tests covering action center retrieval, 404 handling, task status updates, and input validation
- **Frontend** — Component test for `StudentProfile` verifying rendered data, urgency badge, and summary tiles

---

## Key Features

- **Single action-center endpoint** — one API call gives the counselor everything they need for a student
- **Server-side urgency scoring** — consistent priority logic based on open tasks, overdue status, enrollment risk, and unread messages
- **Optimistic updates** — task status changes feel instant via TanStack Query cache manipulation with automatic rollback on failure
- **Accessible UI** — Radix Select for keyboard navigation, ARIA labels, loading skeletons, and error states with retry
- **Structured logging** — JSON request logs with request ID correlation
- **Consistent error handling** — all errors return `{ error: { message, code, requestId } }`

---

## Performance Decisions & Tradeoffs

### Single aggregated endpoint (`GET /students/:id/action-center`)

The action-center endpoint joins student, tasks, and messages server-side and returns everything in **one round-trip**. This avoids waterfall fetches on the frontend (e.g., fetch student → fetch tasks → fetch messages) and keeps the UI responsive. The tradeoff is a slightly heavier response payload, but for a counselor viewing one student at a time, this is negligible compared to the latency saved.

### Server-side urgency computation

Urgency level and reasons are computed **on the backend** rather than the frontend. This ensures every counselor sees the same priority logic regardless of client-side clock differences or stale caches. The scoring algorithm (open tasks, overdue status, enrollment risk, unread count) lives in `services/urgency.ts` as a single source of truth. The tradeoff is that urgency doesn't update in real-time on the client without re-fetching, but `invalidateQueries` after task mutations keeps it in sync.

### Optimistic updates with rollback

Task status changes use TanStack Query's `onMutate` to **instantly update the UI cache** before the PATCH request completes. If the request fails, `onError` restores the previous state, and `onSettled` reconciles with the server. This makes the UI feel instant while maintaining data integrity. The tradeoff is added complexity in the mutation handler, but it significantly improves perceived performance.

### Request ID middleware

Every request gets a UUID (`X-Request-Id`) that flows through logging and error responses. This enables **end-to-end tracing** — a counselor reporting an issue can share the request ID, and we can correlate it across logs instantly. The overhead is one `uuid()` call per request (< 1ms).

### App factory pattern (`createApp()`)

The Express app is created via a factory function rather than a module-level singleton. This allows integration tests to create a fresh app instance and hit the real middleware stack **without binding a port**. The tradeoff is that the current mock data is module-level (shared across tests), which means test order can matter for mutations — a known limitation documented in the architecture notes.

### In-memory mock data

Data is stored in a plain TypeScript array rather than a database. This keeps the assessment focused on API design and frontend integration without infrastructure overhead. For production, this would be replaced with MongoDB repositories behind the same service interface — the frontend contract would not change.

---

## Build for Production

```bash
npm run build
```

This compiles the backend with `tsc` and builds the frontend with Vite.

---

## License

Private — Zyra Software Engineer Assessment
