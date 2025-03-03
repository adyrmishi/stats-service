import request from "supertest";
import { app, server } from "../../src/server";

afterAll(() => {
  server.close();
});

describe("Stats API endpoints", () => {
  it("should create a session study event", async () => {
    const response = await request(app)
      .post("/courses/course123")
      .set("userid", "user123")
      .send({
        sessionId: "session1",
        totalModulesStudied: 10,
        averageScore: 85,
        timeStudied: 120,
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Created");
    expect(response.body.sessionStudyEvent).toHaveProperty("courseId");
    expect(response.body.sessionStudyEvent).toHaveProperty("sessionId");
  });

  it("should return course lifetime stats", async () => {
    const response = await request(app)
      .get("/courses/course123")
      .set("userid", "user123");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Course lifetime stats");
    expect(response.body.data).toHaveProperty("totalModulesStudied");
    expect(response.body.data).toHaveProperty("averageScore");
    expect(response.body.data).toHaveProperty("timeStudied");
  });

  it("should return session stats when session id is specified", async () => {
    const response = await request(app)
      .get("/courses/course123/sessions/session1")
      .set("userid", "user123");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Session stats");
    expect(response.body.sessionStats.Item).toHaveProperty(
      "totalModulesStudied"
    );
  });

  it("should return 400 if userId is missing", async () => {
    const response = await request(app).get("/courses/course123").send({
      sessionId: "session1",
      totalModulesStudied: 10,
      averageScore: 85,
      timeStudied: 120,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("userId is required in the headers");
  });
});
