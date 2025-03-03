"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const express = __importStar(require("express"));
const StatsService_1 = __importDefault(require("../services/StatsService"));
const router = express.Router();
function getUserIdOrThrow(userId) {
    if (Array.isArray(userId) || !userId) {
        throw new Error("Invalid userId");
    }
    return userId;
}
router.post("/:courseId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const { sessionId, totalModulesStudied, averageScore, timeStudied } = req.body;
    const { userid } = req.headers;
    const userId = getUserIdOrThrow(userid);
    try {
        const sessionStudyEvent = yield StatsService_1.default.addSessionStudyEvent({
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
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({
                message: "Failed to create session study event",
                error: err.message,
            });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}));
router.get("/:courseId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const { userid } = req.headers;
    const userId = getUserIdOrThrow(userid);
    try {
        const courseLifetimeData = yield StatsService_1.default.getCourseLifetimeStats({
            courseId,
            userId,
        });
        res.status(200).json({
            message: "Course lifetime stats",
            data: courseLifetimeData,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({
                message: "Failed to get course lifetime stats",
                error: err.message,
            });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}));
router.get("/:courseId/sessions/:sessionId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId, sessionId } = req.params;
    const { userid } = req.headers;
    const userId = getUserIdOrThrow(userid);
    try {
        const sessionStats = yield StatsService_1.default.getSessionStats({
            courseId,
            sessionId,
            userId,
        });
        res.status(200).json({
            message: "Session stats",
            sessionStats,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({
                message: "Failed to get session stats",
                error: err.message,
            });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}));
exports.default = router;
