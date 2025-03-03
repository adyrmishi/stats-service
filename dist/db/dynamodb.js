"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dynamoDB = new client_dynamodb_1.DynamoDBClient({
    region: process.env.AWS_DEFAULT_REGION,
    endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
});
exports.default = dynamoDB;
