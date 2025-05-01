import { S3Client } from '@aws-sdk/client-s3';
import dotenv from "dotenv";
dotenv.config();


const s3 = new S3Client()
console.log(process.env.ACCESS_KEY,"access_key")
console.log(process.env.NEW_AWS_ACCESS_SECRET,"secret_key")
export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.NEW_AWS_ACCESS_SECRET,
  },
});
