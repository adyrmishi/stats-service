"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildKey = exports.STATS_TABLE = void 0;
exports.STATS_TABLE = "stats";
const buildKey = (courseId, sessionId) => `${courseId}#${sessionId}`;
exports.buildKey = buildKey;
