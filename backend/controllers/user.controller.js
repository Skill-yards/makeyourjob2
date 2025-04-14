import asyncHandler from "express-async-handler";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../utils/file.upload.service.js";
import { sendEmail } from "../utils/send.email.service.js";
import path from "path";
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Send OTP for Signup
export const sendOtp = asyncHandler(async (req, res) => {
    const { email, role } = req.body;

    if (!email || !role) {
        res.status(400);
        throw new Error("Email and role are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    if (role !== user.role) {
        res.status(400);
        throw new Error("Account doesn't exist with current role");
    }
    if (!user.isVerified) {
        res.status(400);
        throw new Error("Please verify your email first (via signup)");
    }

    const otp = generateOTP();
    await sendEmail({
        to: email,
        subject: "Login OTP",
        otp,
    });

    res.status(200).json({ success: true, message: "OTP sent to your email", otp });
});


export const sendOtpForRegister = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error("Email required");
    }

    const otp = generateOTP();
    await sendEmail({
        to: email,
        subject: "Register OTP",
        otp,
    })
    res.status(200).json({ success: true, message: "OTP sent to your email", otp });
});


// Resend OTP for Signup
export const resendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error("Email is required");
    }

    const user = await User.findOne({ email }).lean();
    if (user && user.isVerified) {
        res.status(400);
        throw new Error("Email already verified");
    }

    const otp = generateOTP();
    const otpExpiration = Date.now() + 10 * 60 * 1000;
    await sendEmail({
        to: email,
        subject: "Verify Your Email",
        otp,
    });

    await User.updateOne(
        { email },
        { $set: { otp, otpExpiration } },
        { upsert: true }
    );


    res.status(200).json({ success: true, message: "New OTP sent successfully" });
});

// Request OTP for Login/Reset Password
export const requestOtp = asyncHandler(async (req, res) => {
    const { email, role } = req.body;

    if (!email || !role) {
        res.status(400);
        throw new Error("Email and role are required");
    }

    const user = await User.findOne({ email }).lean();

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    if (role !== user.role) {
        res.status(400);
        throw new Error("Account doesn't exist with current role");
    }

    if (!user.isVerified) {
        res.status(400);
        throw new Error("Please verify your email first");
    }

    const otp = generateOTP();
    await sendEmail({
        to: email,
        subject: "Your OTP for Login/Reset Password",
        otp,
    });

    res.status(200).json({ success: true, message: "OTP sent to your email" });
});

// Verify Email
export const verifyEmail = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        res.status(400);
        throw new Error("Email and OTP are required");
    }

    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
        res.status(400);
        throw new Error("Invalid or expired OTP");
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Email verified successfully",
        email,
        isVerified: true,
    });
});

// Register
export const register = asyncHandler(async (req, res) => {
    const {
        firstname,
        lastname,
        email,
        phoneNumber,
        password,
        role,
        gender,
        isOtpVerified,
        organization,
        jobRole,
    } = req.body;
    const file = req.file;

    const requiredFields = ["email", "firstname", "role", "gender", "phoneNumber", "password"];
    if (!requiredFields.every((field) => req.body[field]) || !isOtpVerified) {
        res.status(400);
        throw new Error("All fields are required and OTP must be verified");
    }

    const userExists = await User.findOne({ email }).lean();
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const newUser = new User({
        firstname,
        lastname: lastname || "",
        email,
        phoneNumber: phoneNumber || "",
        role,
        gender,
        isVerified: true,
        profile: { organization: organization || "", jobRole: jobRole || "" },
    });

    if (file) {
        const fileKey = `uploads/${Date.now()}_profile${file.originalname ? path.extname(file.originalname) : ""}`;
        const uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
        };
        await s3Client.send(new PutObjectCommand(uploadParams));
        newUser.profile.profilePhoto = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    }

    newUser.password = await bcrypt.hash(password, 10);
    const savedUser = await newUser.save();

    const token = jwt.sign({ userId: savedUser._id, role: savedUser.role }, process.env.SCREAKET_KEY, {
        expiresIn: "1d",
    });

    const userResponse = {
        _id: savedUser._id,
        firstname: savedUser.firstname,
        lastname: savedUser.lastname,
        email: savedUser.email,
        phoneNumber: savedUser.phoneNumber,
        role: savedUser.role,
        gender: savedUser.gender,
        profile: savedUser.profile,
    };

    res
        .status(201)
        .cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })
        .json({ success: true, message: "Account registered successfully", user: userResponse });
});

// Login
export const login = asyncHandler(async (req, res) => {
    console.log(req.body,"sjabdkja")
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        res.status(400);
        throw new Error("Email, password, and role are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    if (role !== user.role) {
        res.status(400);
        throw new Error("Account doesn't exist with current role");
    }
    if (!user.isVerified) {
        res.status(400);
        throw new Error("Please verify your email first");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(400);
        throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    const userResponse = {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile,
    };

    res
        .status(200)
        .cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })
        .json({ success: true, message: `Welcome back ${user.firstname}`, user: userResponse });
});
// Logout
export const logout = asyncHandler(async (req, res) => {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ success: true, message: "Logged out successfully" });
});

// Update Profile
export const updateProfile = asyncHandler(async (req, res) => {
    const { firstname, lastname, email, phoneNumber, bio, skills, organization, jobRole } = req.body;
    const file = req.file;
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    if (file) {
        const fileKey = `${user.role === "candidate" ? "resumes" : "logos"}/${Date.now()}_${file.originalname}`;
        const uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
        };
        await s3Client.send(new PutObjectCommand(uploadParams));
        if (user.role === "candidate") {
            user.profile.resume = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
            user.profile.resumeOriginalName = file.originalname;
        } else {
            user.profile.profilePhoto = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
        }
    }

    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber || user.phoneNumber;

    if (user.role === "candidate") {
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skills.split(",").map((skill) => skill.trim());
    } else {
        if (organization) user.profile.organization = organization;
        if (jobRole) user.profile.jobRole = jobRole;
    }

    await user.save();

    const userResponse = {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile,
    };

    res.status(200).json({ success: true, message: "Profile updated successfully", user: userResponse });
});

// Login with OTP
export const loginWithOtp = asyncHandler(async (req, res) => {
    const { email, role } = req.body;

    if (!email || !role) {
        res.status(400);
        throw new Error("Email and role are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    if (role !== user.role) {
        res.status(400);
        throw new Error("Account doesn't exist with current role");
    }
    if (!user.isVerified) {
        res.status(400);
        throw new Error("Please verify your email first");
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    const userResponse = {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile,
    };

    res
        .status(200)
        .cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })
        .json({ success: true, message: `Welcome back ${user.firstname}`, user: userResponse });
});
// Reset Password
export const resetPassword = asyncHandler(async (req, res) => {
    const { email, newPassword, role } = req.body;

    if (!email || !newPassword || !role) {
        res.status(400);
        throw new Error("Email, new password, and role are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    if (role !== user.role) {
        res.status(400);
        throw new Error("Account doesn't exist with current role");
    }
    if (!user.isVerified) {
        res.status(400);
        throw new Error("Please verify your email first");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully" });
});