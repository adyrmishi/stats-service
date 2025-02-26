class StatsService {
  getUserIdOrThrow(userId: string) {
    if (!userId) {
      throw new Error("userId is a required field");
    }
  }

  async getCourseLifetimeStats({
    courseId,
    userId,
  }: {
    courseId: string;
    userId: string;
  }) {
    return {
      totalModulesStudied: 100,
      averageScore: 85,
      timeStudied: 1200,
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
    return {
      sessionId,
      courseId,
      totalModulesStudied: 10,
      averageScore: 80,
      timeStudied: 300,
    };
  }

  async persistSessionStudyEvent({
    courseId,
    sessionData,
    userId,
  }: {
    courseId: string;
    sessionData: any;
    userId: string;
  }) {
    return {
      sessionId: sessionData.sessionId,
      courseId,
      ...sessionData,
      userId,
    };
  }
}

export default new StatsService();
