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
const dynamodb_1 = __importDefault(require("../../db/dynamodb"));
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const models_1 = require("../../db/models");
class StatsService {
    getCourseLifetimeStats(_a) {
        return __awaiter(this, arguments, void 0, function* ({ courseId, userId, }) {
            const params = {
                TableName: models_1.STATS_TABLE,
                KeyConditionExpression: "userId = :u AND begins_with(#cs, :c)",
                ExpressionAttributeValues: {
                    ":u": { S: userId },
                    ":c": { S: courseId },
                },
                ExpressionAttributeNames: {
                    "#cs": "courseId#sessionId",
                },
            };
            const { Items } = yield dynamodb_1.default.send(new client_dynamodb_1.QueryCommand(params));
            let totalModulesStudied = 0, totalScore = 0, timeStudied = 0, count = 0;
            Items === null || Items === void 0 ? void 0 : Items.forEach((item) => {
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
        });
    }
    getSessionStats(_a) {
        return __awaiter(this, arguments, void 0, function* ({ courseId, sessionId, userId, }) {
            const params = {
                TableName: models_1.STATS_TABLE,
                Key: {
                    userId: { S: userId },
                    "courseId#sessionId": { S: (0, models_1.buildKey)(courseId, sessionId) },
                },
            };
            const { Item } = yield dynamodb_1.default.send(new client_dynamodb_1.GetItemCommand(params));
            return {
                Item,
            };
        });
    }
    addSessionStudyEvent(_a) {
        return __awaiter(this, arguments, void 0, function* ({ courseId, sessionData, userId, }) {
            const { sessionId, totalModulesStudied, averageScore, timeStudied } = sessionData;
            const params = {
                TableName: models_1.STATS_TABLE,
                Item: {
                    userId: { S: userId },
                    "courseId#sessionId": { S: (0, models_1.buildKey)(courseId, sessionId) },
                    totalModulesStudied: { N: totalModulesStudied.toString() },
                    averageScore: { N: averageScore.toString() },
                    timeStudied: { N: timeStudied.toString() },
                },
            };
            yield dynamodb_1.default.send(new client_dynamodb_1.PutItemCommand(params));
            return Object.assign(Object.assign({ courseId }, sessionData), { userId });
        });
    }
}
exports.default = new StatsService();
