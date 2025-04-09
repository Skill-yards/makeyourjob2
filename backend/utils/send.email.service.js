import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Fixed typo from _dirname to __dirname

dotenv.config();

export const sendEmail = async (to, subject, otp, templateFile = null) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      auth: {
        user: process.env.EMAIL_USER || "shahil4278@gmail.com",
        pass: process.env.EMAIL_PASS || "yupqxhpdivmnhovr",
      },
    });

    let htmlTemplate = `
      <div>
        <h2>Email Verification</h2>
        <p>Your OTP is: <strong>${otp}</strong></p>
      </div>
    `;

    if (templateFile) {
      const fullPath = path.resolve(__dirname, templateFile); // Now uses correct __dirname
      if (fs.existsSync(fullPath)) {
        const rawHtml = fs.readFileSync(fullPath, "utf-8");
        htmlTemplate = rawHtml.replace("{{OTP}}", otp);
      } else {
        console.warn(`Template file not found at: ${fullPath}, using default template`);
      }
    }

    const info = await transporter.sendMail({
      from: `"Your Company Name" <${process.env.EMAIL_USER || "shahil4278@gmail.com"}>`,
      to,
      subject,
      html: htmlTemplate,
    });

    console.log(`✅ Email sent successfully: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send email");
  }
};