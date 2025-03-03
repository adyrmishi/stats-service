import * as express from "express";
import { Request, Response } from "express";
import stats from "../services/StatsService";

const router = express.Router();

function getUserIdOrThrow(userId: string | string[] | undefined) {
  if (Array.isArray(userId) || !userId) {
    throw new Error("Invalid userId");
  }
  return userId;
}

router.post(
  "/:courseId",
  async (req: Request, res: Response): Promise<void> => {
    const { courseId } = req.params;
    const { sessionId, totalModulesStudied, averageScore, timeStudied } =
      req.body;
    const { userid } = req.headers;
    const userId = getUserIdOrThrow(userid);
    try {
      const sessionStudyEvent = await stats.addSessionStudyEvent({
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
      if (err instanceof Error) {
        res.status(500).json({
          message: "Failed to create session study event",
          error: err.message,
        });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  }
);

router.get("/:courseId", async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.params;
  const { userid } = req.headers;
  const userId = getUserIdOrThrow(userid);
  try {
    const courseLifetimeData = await stats.getCourseLifetimeStats({
      courseId,
      userId,
    });
    res.status(200).json({
      message: "Course lifetime stats",
      data: courseLifetimeData,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({
        message: "Failed to get course lifetime stats",
        error: err.message,
      });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

router.get(
  "/:courseId/sessions/:sessionId",
  async (req: Request, res: Response): Promise<void> => {
    const { courseId, sessionId } = req.params;
    const { userid } = req.headers;
    const userId = getUserIdOrThrow(userid);

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
      if (err instanceof Error) {
        res.status(500).json({
          message: "Failed to get session stats",
          error: err.message,
        });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  }
);

export default router;
