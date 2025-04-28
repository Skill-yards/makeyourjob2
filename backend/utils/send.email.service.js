import nodemailer from "nodemailer";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";

// Initialize transporter with optimized settings
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "info@skillyards.com ",
        pass:  "gicossqjbgxlnclq",
    },
    pool: true, 
    maxConnections: 5,
    rateLimit: 14, 
    maxMessages: 100, 
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


///// create funcation to send new jobs to user emails when user subScripts the job portals




export const sendJobNotifications = async (job) => {
  try {
    const users = await User.find({
      "subscription.isSubscribed": true,
      $or: [
        { "profile.jobRole": { $regex: job.jobTitle, $options: "i" } },
        { "profile.jobRole": { $regex: job.jobCategory, $options: "i" } },
      ],
    });

    console.log(`Found ${users.length} users for job: ${job.jobTitle}`);
    if (!users.length) {
      console.log("No matching subscribed users found.");
      return;
    }

    // Email template
    const getEmailTemplate = (user, job) => `
      <h2>New Job Opportunity: ${job.jobTitle}</h2>
      <p>Dear ${user.firstname},</p>
      <p>A new job matching your interests has been posted:</p>
      <ul>
        <li><strong>Job Title:</strong> ${job.jobTitle}</li>
        <li><strong>Company:</strong> ${job.companyName}</li>
        <li><strong>Location:</strong> ${job.workLocation.city}, ${job.workLocation.state}</li>
        <li><strong>Job Type:</strong> ${job.jobType}</li>
        <li><strong>Category:</strong> ${job.jobCategory}</li>
        <li><strong>Skills:</strong> ${job.skills.join(", ")}</li>
      </ul>
      <p><a href="https://your-job-portal.com/jobs/${job._id}">View Job Details</a></p>
      <p>Best regards,<br>Your Job Portal Team</p>
    `;

    // Send emails with basic throttling
    const emailPromises = users.map(async (user) => {
      const mailOptions = {
        from: "info@skillyards.com",
        to: user.email,
        subject: `New Job Alert: ${job.jobTitle}`,
        html: getEmailTemplate(user, job),
      };
      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${user.email}`);
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error.message);
      }
    });

    await Promise.all(emailPromises);
    console.log(`Processed ${users.length} email notifications for job: ${job.jobTitle}`);
  } catch (error) {
    console.error("Error in sendJobNotifications:", {
      error: error.message,
      stack: error.stack,
      jobId: job._id,
    });
  }
};