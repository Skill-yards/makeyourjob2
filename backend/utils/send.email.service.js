import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  auth: {
    user: process.env.EMAIL_USER || "shahil4278@gmail.com",
    pass: process.env.EMAIL_PASS || "yupqxhpdivmnhovr",
  },
});

export const sendEmail = async (to, subject, otp, role) => {
  try {
    const templatePath = path.resolve(__dirname, "../static", `welcome.html`);
    let htmlTemplate;

    try {
      htmlTemplate = await fs.readFile(templatePath, "utf-8");
      htmlTemplate = htmlTemplate.replace("{{OTP}}", otp);
    } catch (fileError) {
      console.warn(`Template not found for ${role} at ${templatePath}, using default`);
      htmlTemplate = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Your OTP is: <strong style="font-size: 18px; color: #007bff;">${otp}</strong></p>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `;
    }

    const mailOptions = {
      from: `"Unstop" <${process.env.EMAIL_USER || "shahil4278@gmail.com"}>`,
      to,
      subject,
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw new Error("Failed to send OTP email");
  }
};