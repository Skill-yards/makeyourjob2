import { S3Client } from '@aws-sdk/client-s3';
import dotenv from "dotenv";
dotenv.config();


const s3 = new S3Client()


export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.NEW_AWS_ACCESS_SECRET,
  },
});
