import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({
  region: process.env.region,
  credentials: {
    accessKeyId: process.env.bucket_access_key,
    secretAccessKey: process.env.bucket_secret_key,
  },
});

export default s3;
