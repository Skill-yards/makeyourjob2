import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs/promises"; // Use fs.promises for async file handling
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Singleton transporter instance
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    port: 465,
    auth: {
      user: process.env.EMAIL_USER || "shahil4278@gmail.com",
      pass: process.env.EMAIL_PASS || "yupqxhpdivmnhovr",
    },
  });
};

let transporter = createTransporter();

export const sendEmail = async (to, subject, otp, templateFile = null) => {
  try {
    // Reinitialize transporter if credentials change (e.g., environment reload)
    if (process.env.EMAIL_USER !== transporter.options.auth.user || process.env.EMAIL_PASS !== transporter.options.auth.pass) {
      transporter = createTransporter();
    }

    let htmlTemplate = `
      <div>
        <h2>Email Verification</h2>
        <p>Your OTP is: <strong>${otp}</strong></p>
      </div>
    `;

    if (templateFile) {
      const fullPath = path.resolve(__dirname, templateFile);
      try {
        const rawHtml = await fs.readFile(fullPath, "utf-8");
        htmlTemplate = rawHtml.replace("{{OTP}}", otp);
      } catch (fileError) {
        console.warn(`Template file not found at: ${fullPath}, using default template`, fileError);
      }
    }

    const info = await transporter.sendMail({
      from: `"Your Company Name" <${process.env.EMAIL_USER || "shahil4278@gmail.com"}>`,
      to,
      subject,
      html: htmlTemplate,
    });

    console.log(`✅ Email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send email");
  }
};