import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export const sendEmail = async (to, subject, otp) => {
    try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          port: 465,
          auth: {
            user: "shahil4278@gmail.com",
            pass: "yupqxhpdivmnhovr",
          },
        });
        const htmlTemplate = `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 5px;">
                <h2 style="color: #333; text-align: center;">Email Verification</h2>
                <p>Hello,</p>
                <p>Thank you for registering. Use the OTP below to verify your email:</p>
                <div style="text-align: center; font-size: 24px; font-weight: bold; padding: 10px; background-color: #f4f4f4; border-radius: 5px; display: inline-block;">
                    ${otp}
                </div>
                <p>This OTP is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
                <p>Thank you,<br><strong>Your Company Name</strong></p>
            </div>
        `;
        const info = await transporter.sendMail({
            from: to,
            to,
            subject,
            html: htmlTemplate,
        });
        console.log(`Email sent successfully: ${info.messageId}`);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
};





