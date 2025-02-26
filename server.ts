import express from "express";
import stats from "./StatsService";

const app = express();
const port = 3000;
app.use(express.json());

app.post("/courses/:courseId", async (req, res) => {
  const { courseId } = req.params;
  const { sessionId, totalModulesStudied, averageScore, timeStudied } =
    req.body;
  const { userId } = req.headers;

  try {
    const sessionStudyEvent = await stats.persistSessionStudyEvent({
      courseId,
      sessionData: {
        sessionId,
        totalModulesStudied,
        averageScore,
        timeStudied,
      },
      userId,
    });

    res.status(201).json({
      message: "Created",
      sessionStudyEvent,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create session study event",
      error: err.message,
    });
  }
});

app.get("/courses/:courseId", async (req, res) => {
  const { courseId } = req.params;
  const { userId } = req.headers;

  try {
    const courseLifetimeData = await stats.getCourseLifetimeStats({
      courseId,
      userId,
    });
    res.status(200).json({
      message: "Course lifetime stats",
      courseLifetimeData,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to get course lifetime stats",
      error: err.message,
    });
  }
});

app.get("/courses/:courseId/sessions/:sessionId", async (req, res) => {
  const { courseId, sessionId } = req.params;
  const { userId } = req.headers;

  try {
    const sessionStats = await stats.getSessionStats({
      courseId,
      sessionId,
      userId,
    });
    res.status(200).json({
      message: "Session stats",
      sessionStats,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to get session stats",
      error: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
