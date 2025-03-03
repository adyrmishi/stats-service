import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";

dotenv.config();

const dynamoDB = new DynamoDBClient({
  region: process.env.AWS_DEFAULT_REGION || "eu-west-2",
  credentials:
    process.env.NODE_ENV === "production"
      ? undefined
      : {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || "dummy-access-key",
          secretAccessKey:
            process.env.AWS_SECRET_ACCESS_KEY || "dummy-secret-key",
        },
});

export default dynamoDB;
