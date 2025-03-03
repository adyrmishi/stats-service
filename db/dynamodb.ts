import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";

dotenv.config();

const dynamoDB = new DynamoDBClient({
  region: process.env.AWS_DEFAULT_REGION || "eu-west-2",
  endpoint:
    process.env.NODE_ENV === "production"
      ? undefined
      : process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
});

export default dynamoDB;
