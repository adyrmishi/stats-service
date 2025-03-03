import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";

dotenv.config();

const dynamoDB = new DynamoDBClient({
  region: process.env.AWS_DEFAULT_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
});

export default dynamoDB;
