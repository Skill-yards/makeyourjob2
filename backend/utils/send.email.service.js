import nodemailer from "nodemailer";

// Initialize transporter with optimized settings
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER || "shahil4278@gmail.com",
        pass: process.env.EMAIL_PASS || "yupqxhpdivmnhovr",
    },
    pool: true, // Use connection pooling for faster subsequent sends
    maxConnections: 5, // Allow multiple connections to handle concurrent emails
    rateLimit: 14, // Gmail's approximate limit (14 emails per second)
    maxMessages: 100, // Prevent queue overload
});

export const sendEmail = async ({ to, subject, otp }) => {
    
    try {
        if (!to || !subject || !otp) {
            throw new Error("Missing required email parameters");
        }

        const mailOptions = {
            from: `"make your job" <${process.env.EMAIL_USER || "info@skillyards.com"}>`,
            to,
            subject,
            text: `Your OTP is ${otp}. It expires in 10 minutes. If you didn’t request this, please ignore this email.`,
            priority: "high", // Set email priority to high
        };

        // Send email with promise-based handling
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`Email sending failed for ${to}:`, error.message);
        throw new Error("Failed to send OTP email");
    }
};

// Optional: Pre-warm the connection pool
transporter.verify((error, success) => {
    if (error) {
        console.error("Transporter verification failed:", error.message);
    } else {
        console.log("SMTP transporter ready");
    }
});