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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../../src/server");
afterAll(() => {
    server_1.server.close();
});
describe("Stats API endpoints", () => {
    it("should create a session study event", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app)
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
    }));
    it("should return course lifetime stats", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app)
            .get("/courses/course123")
            .set("userid", "user123");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Course lifetime stats");
        expect(response.body.data).toHaveProperty("totalModulesStudied");
        expect(response.body.data).toHaveProperty("averageScore");
        expect(response.body.data).toHaveProperty("timeStudied");
    }));
    it("should return session stats when session id is specified", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app)
            .get("/courses/course123/sessions/session1")
            .set("userid", "user123");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Session stats");
        expect(response.body.sessionStats.Item).toHaveProperty("totalModulesStudied");
    }));
    it("should return 400 if userId is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app).get("/courses/course123").send({
            sessionId: "session1",
            totalModulesStudied: 10,
            averageScore: 85,
            timeStudied: 120,
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("userId is required in the headers");
    }));
});
