import dynamoDB from "../../db/dynamodb";
import {
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { buildKey, STATS_TABLE } from "../../db/models";

type SessionData = {
  sessionId: string;
  totalModulesStudied: number;
  averageScore: number;
  timeStudied: number;
};

class StatsService {
  async getCourseLifetimeStats({
    courseId,
    userId,
  }: {
    courseId: string;
    userId: string;
  }) {
    const params = {
      TableName: STATS_TABLE,
      KeyConditionExpression: "userId = :u AND begins_with(#cs, :c)",
      ExpressionAttributeValues: {
        ":u": { S: userId },
        ":c": { S: courseId },
      },
      ExpressionAttributeNames: {
        "#cs": "courseId#sessionId",
      },
    };

    const { Items } = await dynamoDB.send(new QueryCommand(params));

    let totalModulesStudied = 0,
      totalScore = 0,
      timeStudied = 0,
      count = 0;
    Items?.forEach((item) => {
      totalModulesStudied += Number(item.totalModulesStudied.N);
      totalScore += Number(item.averageScore.N);
      timeStudied += Number(item.timeStudied.N);
      count++;
    });
    return {
      totalModulesStudied,
      averageScore: count > 0 ? totalScore / count : totalScore,
      timeStudied,
    };
  }

  async getSessionStats({
    courseId,
    sessionId,
    userId,
  }: {
    courseId: string;
    sessionId: string;
    userId: string;
  }) {
    const params = {
      TableName: STATS_TABLE,
      Key: {
        userId: { S: userId },
        "courseId#sessionId": { S: buildKey(courseId, sessionId) },
      },
    };

    const { Item } = await dynamoDB.send(new GetItemCommand(params));

    return {
      Item,
    };
  }

  async addSessionStudyEvent({
    courseId,
    sessionData,
    userId,
  }: {
    courseId: string;
    sessionData: SessionData;
    userId: string;
  }) {
    const { sessionId, totalModulesStudied, averageScore, timeStudied } =
      sessionData;

    const params = {
      TableName: STATS_TABLE,
      Item: {
        userId: { S: userId },
        "courseId#sessionId": { S: buildKey(courseId, sessionId) },
        totalModulesStudied: { N: totalModulesStudied.toString() },
        averageScore: { N: averageScore.toString() },
        timeStudied: { N: timeStudied.toString() },
      },
      ConditionExpression: "attribute_not_exists(#pk)",
      ExpressionAttributeNames: {
        "#pk": "courseId#sessionId",
      },
    };
    await dynamoDB.send(new PutItemCommand(params));

    return {
      courseId,
      ...sessionData,
      userId,
    };
  }
}

export default new StatsService();
