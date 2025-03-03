"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const StatsService_1 = __importDefault(require("../../src/services/StatsService"));
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const models_1 = require("../../db/models");
const dynamodb_1 = __importDefault(require("../../db/dynamodb"));
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
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            for (const session of sessions) {
                yield dynamodb_1.default.send(new client_dynamodb_1.DeleteItemCommand({
                    TableName: models_1.STATS_TABLE,
                    Key: {
                        userId: { S: testUserId },
                        "courseId#sessionId": {
                            S: (0, models_1.buildKey)(testCourseId, session.sessionId),
                        },
                    },
                }));
            }
            for (const session of sessions) {
                yield dynamodb_1.default.send(new client_dynamodb_1.PutItemCommand({
                    TableName: models_1.STATS_TABLE,
                    Item: {
                        userId: { S: testUserId },
                        "courseId#sessionId": {
                            S: (0, models_1.buildKey)(testCourseId, session.sessionId),
                        },
                        totalModulesStudied: {
                            N: session.totalModulesStudied.toString(),
                        },
                        averageScore: { N: session.averageScore.toString() },
                        timeStudied: { N: session.timeStudied.toString() },
                    },
                }));
            }
        }));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            for (const session of sessions) {
                yield dynamodb_1.default.send(new client_dynamodb_1.DeleteItemCommand({
                    TableName: models_1.STATS_TABLE,
                    Key: {
                        userId: { S: testUserId },
                        "courseId#sessionId": {
                            S: (0, models_1.buildKey)(testCourseId, session.sessionId),
                        },
                    },
                }));
            }
        }));
        it("should return correct lifetime stats", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield StatsService_1.default.getCourseLifetimeStats({
                courseId: testCourseId,
                userId: testUserId,
            });
            expect(response).toEqual({
                totalModulesStudied: 12,
                averageScore: 87.5,
                timeStudied: 350,
            });
        }));
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
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield dynamodb_1.default.send(new client_dynamodb_1.PutItemCommand({
                TableName: models_1.STATS_TABLE,
                Item: {
                    userId: { S: testUserId },
                    "courseId#sessionId": { S: (0, models_1.buildKey)(testCourseId, testSessionId) },
                    totalModulesStudied: {
                        N: sessionData.totalModulesStudied.toString(),
                    },
                    averageScore: { N: sessionData.averageScore.toString() },
                    timeStudied: { N: sessionData.timeStudied.toString() },
                },
            }));
        }));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield dynamodb_1.default.send(new client_dynamodb_1.DeleteItemCommand({
                TableName: models_1.STATS_TABLE,
                Key: {
                    userId: { S: testUserId },
                    "courseId#sessionId": { S: (0, models_1.buildKey)(testCourseId, testSessionId) },
                },
            }));
        }));
        it("should return correct session stats", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield StatsService_1.default.getSessionStats({
                courseId: testCourseId,
                sessionId: testSessionId,
                userId: testUserId,
            });
            expect(response.Item).toEqual({
                userId: { S: testUserId },
                "courseId#sessionId": { S: (0, models_1.buildKey)(testCourseId, testSessionId) },
                totalModulesStudied: { N: "5" },
                averageScore: { N: "85" },
                timeStudied: { N: "150" },
            });
        }));
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
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield dynamodb_1.default.send(new client_dynamodb_1.DeleteItemCommand({
                TableName: models_1.STATS_TABLE,
                Key: {
                    userId: { S: testUserId },
                    "courseId#sessionId": {
                        S: (0, models_1.buildKey)(testCourseId, newSessionData.sessionId),
                    },
                },
            }));
        }));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield dynamodb_1.default.send(new client_dynamodb_1.DeleteItemCommand({
                TableName: models_1.STATS_TABLE,
                Key: {
                    userId: { S: testUserId },
                    "courseId#sessionId": {
                        S: (0, models_1.buildKey)(testCourseId, newSessionData.sessionId),
                    },
                },
            }));
        }));
        it("should add a session study event and retrieve it", () => __awaiter(void 0, void 0, void 0, function* () {
            const addedSession = yield StatsService_1.default.addSessionStudyEvent({
                courseId: testCourseId,
                sessionData: newSessionData,
                userId: testUserId,
            });
            const response = yield dynamodb_1.default.send(new client_dynamodb_1.GetItemCommand({
                TableName: models_1.STATS_TABLE,
                Key: {
                    userId: { S: testUserId },
                    "courseId#sessionId": {
                        S: (0, models_1.buildKey)(testCourseId, newSessionData.sessionId),
                    },
                },
            }));
            expect(response.Item).toEqual({
                userId: { S: testUserId },
                "courseId#sessionId": {
                    S: (0, models_1.buildKey)(testCourseId, newSessionData.sessionId),
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
        }));
    });
});
