import StatsService from "../../src/services/StatsService";
import {
  PutItemCommand,
  GetItemCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { buildKey, STATS_TABLE } from "../../db/models";
import dynamoDB from "../../db/dynamodb";

describe("StatsService Integration Tests", () => {
  describe("getCourseLifetimeStats", () => {
    const testUserId = "lifetimeUser123";
    const testCourseId = "lifetimeCourse123";
    const sessions = [
      {
        sessionId: "session1",
        totalModulesStudied: 5,
        averageScore: 85,
        timeStudied: 150,
      },
      {
        sessionId: "session2",
        totalModulesStudied: 7,
        averageScore: 90,
        timeStudied: 200,
      },
    ];

    beforeAll(async () => {
      for (const session of sessions) {
        await dynamoDB.send(
          new DeleteItemCommand({
            TableName: STATS_TABLE,
            Key: {
              userId: { S: testUserId },
              "courseId#sessionId": {
                S: buildKey(testCourseId, session.sessionId),
              },
            },
          })
        );
      }
      for (const session of sessions) {
        await dynamoDB.send(
          new PutItemCommand({
            TableName: STATS_TABLE,
            Item: {
              userId: { S: testUserId },
              "courseId#sessionId": {
                S: buildKey(testCourseId, session.sessionId),
              },
              totalModulesStudied: {
                N: session.totalModulesStudied.toString(),
              },
              averageScore: { N: session.averageScore.toString() },
              timeStudied: { N: session.timeStudied.toString() },
            },
          })
        );
      }
    });

    afterAll(async () => {
      for (const session of sessions) {
        await dynamoDB.send(
          new DeleteItemCommand({
            TableName: STATS_TABLE,
            Key: {
              userId: { S: testUserId },
              "courseId#sessionId": {
                S: buildKey(testCourseId, session.sessionId),
              },
            },
          })
        );
      }
    });

    it("should return correct lifetime stats", async () => {
      const response = await StatsService.getCourseLifetimeStats({
        courseId: testCourseId,
        userId: testUserId,
      });
      expect(response).toEqual({
        totalModulesStudied: 12,
        averageScore: 87.5,
        timeStudied: 350,
      });
    });
  });

  describe("getSessionStats", () => {
    const testUserId = "sessionUser123";
    const testCourseId = "sessionCourse123";
    const testSessionId = "session1";
    const sessionData = {
      sessionId: testSessionId,
      totalModulesStudied: 5,
      averageScore: 85,
      timeStudied: 150,
    };

    beforeAll(async () => {
      await dynamoDB.send(
        new PutItemCommand({
          TableName: STATS_TABLE,
          Item: {
            userId: { S: testUserId },
            "courseId#sessionId": { S: buildKey(testCourseId, testSessionId) },
            totalModulesStudied: {
              N: sessionData.totalModulesStudied.toString(),
            },
            averageScore: { N: sessionData.averageScore.toString() },
            timeStudied: { N: sessionData.timeStudied.toString() },
          },
        })
      );
    });

    afterAll(async () => {
      await dynamoDB.send(
        new DeleteItemCommand({
          TableName: STATS_TABLE,
          Key: {
            userId: { S: testUserId },
            "courseId#sessionId": { S: buildKey(testCourseId, testSessionId) },
          },
        })
      );
    });

    it("should return correct session stats", async () => {
      const response = await StatsService.getSessionStats({
        courseId: testCourseId,
        sessionId: testSessionId,
        userId: testUserId,
      });
      expect(response.Item).toEqual({
        userId: { S: testUserId },
        "courseId#sessionId": { S: buildKey(testCourseId, testSessionId) },
        totalModulesStudied: { N: "5" },
        averageScore: { N: "85" },
        timeStudied: { N: "150" },
      });
    });
  });

  describe("addSessionStudyEvent", () => {
    const testUserId = "addSessionUser123";
    const testCourseId = "addSessionCourse123";
    const newSessionData = {
      sessionId: "session1",
      totalModulesStudied: 7,
      averageScore: 90,
      timeStudied: 200,
    };

    beforeAll(async () => {
      await dynamoDB.send(
        new DeleteItemCommand({
          TableName: STATS_TABLE,
          Key: {
            userId: { S: testUserId },
            "courseId#sessionId": {
              S: buildKey(testCourseId, newSessionData.sessionId),
            },
          },
        })
      );
    });

    afterAll(async () => {
      await dynamoDB.send(
        new DeleteItemCommand({
          TableName: STATS_TABLE,
          Key: {
            userId: { S: testUserId },
            "courseId#sessionId": {
              S: buildKey(testCourseId, newSessionData.sessionId),
            },
          },
        })
      );
    });

    it("should add a session study event and retrieve it", async () => {
      const addedSession = await StatsService.addSessionStudyEvent({
        courseId: testCourseId,
        sessionData: newSessionData,
        userId: testUserId,
      });

      const response = await dynamoDB.send(
        new GetItemCommand({
          TableName: STATS_TABLE,
          Key: {
            userId: { S: testUserId },
            "courseId#sessionId": {
              S: buildKey(testCourseId, newSessionData.sessionId),
            },
          },
        })
      );

      expect(response.Item).toEqual({
        userId: { S: testUserId },
        "courseId#sessionId": {
          S: buildKey(testCourseId, newSessionData.sessionId),
        },
        totalModulesStudied: { N: "7" },
        averageScore: { N: "90" },
        timeStudied: { N: "200" },
      });

      expect(addedSession).toEqual({
        courseId: testCourseId,
        sessionId: newSessionData.sessionId,
        totalModulesStudied: 7,
        averageScore: 90,
        timeStudied: 200,
        userId: testUserId,
      });
    });
  });
});
