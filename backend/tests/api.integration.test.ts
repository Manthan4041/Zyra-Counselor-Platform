import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

describe("Action Center API", () => {
  const app = createApp();

  it("GET /students/stu_001/action-center returns aggregated counselor view", async () => {
    const res = await request(app)
      .get("/students/stu_001/action-center")
      .expect(200);

    expect(res.headers["x-request-id"]).toBeDefined();
    expect(res.body.student.id).toBe("stu_001");
    expect(res.body.student.name).toBe("Maya Patel");
    expect(res.body.unreadMessagesCount).toBe(2);
    expect(res.body.tasks).toHaveLength(5);
    expect(res.body.urgencyLevel).toBe("critical");
    expect(res.body.summary.openTasks).toBe(4);
    expect(res.body.summary.urgentOpenTasks).toBe(2);
    expect(res.body.summary.overdueOpenTasks).toBeGreaterThanOrEqual(1);
  });

  it("GET /students/unknown/action-center returns 404 with request id", async () => {
    const res = await request(app)
      .get("/students/stu_999/action-center")
      .expect(404);

    expect(res.body.error.code).toBe("STUDENT_NOT_FOUND");
    expect(res.body.error.requestId).toBe(res.headers["x-request-id"]);
  });

  it("PATCH /tasks/:id/status updates task and persists in subsequent GET", async () => {
    const patchRes = await request(app)
      .patch("/tasks/tsk_001/status")
      .send({ status: "in_progress" })
      .expect(200);

    expect(patchRes.body.task.status).toBe("in_progress");
    expect(patchRes.body.task.id).toBe("tsk_001");

    const getRes = await request(app)
      .get("/students/stu_001/action-center")
      .expect(200);

    const task = getRes.body.tasks.find(
      (t: { id: string }) => t.id === "tsk_001"
    );
    expect(task.status).toBe("in_progress");
  });

  it("PATCH /tasks/invalid/status with bad body returns 400", async () => {
    const res = await request(app)
      .patch("/tasks/tsk_001/status")
      .send({ status: "invalid" })
      .expect(400);

    expect(res.body.error.code).toBe("INVALID_STATUS");
  });
});
