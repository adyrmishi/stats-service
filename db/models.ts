export const STATS_TABLE = "stats";
export const buildKey = (courseId: string, sessionId: string) =>
  `${courseId}#${sessionId}`;
