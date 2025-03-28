// import {v2 as cloudinary} from "cloudinary";
// import dotenv from "dotenv";
// dotenv.config();

// cloudinary.config({
//     cloud_name:process.env.CLOUD_NAME,
//     api_key:process.env.API_KEY,
//     api_secret:process.env.API_SECRET
// });
// export default cloudinary;




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
