"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const statsRoutes_1 = __importDefault(require("./routes/statsRoutes"));
const app = (0, express_1.default)();
exports.app = app;
const port = process.env.PORT || 8080;
const checkUserIdInHeaders = (req, res, next) => {
    const userId = req.headers.userid;
    if (!userId) {
        res.status(400).json({ message: "userId is required in the headers" });
        return;
    }
    next();
};
app.use(express_1.default.json());
app.use("/courses", checkUserIdInHeaders, statsRoutes_1.default);
app.use((err, req, res, next) => {
    // ✅ Added `next`
    console.error(err.stack);
    res.status(500).json({
        message: "Internal Server Error",
        error: "An error occurred",
    });
});
app.get("/", (req, res) => {
    res.send("Health check OK");
});
const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
exports.server = server;
