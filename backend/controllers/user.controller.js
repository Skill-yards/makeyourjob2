import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../utils/file.upload.service.js";
import dotenv from "dotenv";
import { sendEmail } from "../utils/send.email.service.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const otpStore = new Map();

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

const validateRequiredFields = (fields, required) => {
    for (const field of required) {
        if (!fields[field]) return false;
    }
    return true;
};

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required", success: false });
        }

        const otp = generateOTP();
        const expiration = Date.now() + 10 * 60 * 1000; // 10 minutes

        otpStore.set(email, { otp, expiration });
        await sendEmail(email, "Verify Your Email", otp, "candidate"); // Default to "candidate" role for simplicity

        return res.status(200).json({ message: "OTP sent to your email", success: true });
    } catch (error) {
        handleError(res, error);
    }
};

const handleError = (res, error, defaultMessage = "Server Error") => {
    console.error(`${error.stack || error.message}`);
    return res.status(500).json({ message: defaultMessage, success: false, error: error.message });
};

export const register = async (req, res) => {
    try {
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
        if (!validateRequiredFields(req.body, requiredFields) || !isOtpVerified) {
            return res.status(400).json({
                message: "All fields are required and OTP must be verified",
                success: false,
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists", success: false });
        }

        const newUser = new User({
            firstname,
            lastname: lastname || "",
            email,
            phoneNumber: Number(phoneNumber) || "",
            role,
            gender,
            isVerified: true,
            profile: { organization: organization || "", jobRole: jobRole || "" },
        });

        if (file) {
            const fileKey = `uploads/${Date.now()}_profile${path.extname(file.originalname)}`;
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
        const token = jwt.sign({ userId: savedUser._id, role: savedUser.role }, process.env.SCREAKET_KEY, { expiresIn: "1d" });

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

        return res
            .status(201)
            .cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })
            .json({ message: "Account registered successfully", success: true, user: userResponse });
    } catch (error) {
        handleError(res, error);
    }
};



export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!validateRequiredFields(req.body, ["email", "password", "role"])) {
            return res.status(400).json({ message: "Email, password, and role are required", success: false });
        }

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password)) || role !== user.role || !user.isVerified) {
            return res.status(400).json({ message: "Invalid credentials or unverified email", success: false });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SCREAKET_KEY, { expiresIn: "1d" });
        const userResponse = {
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };

        return res
            .status(200)
            .cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })
            .json({ message: `Welcome back ${user.firstname}`, user: userResponse, success: true });
    } catch (error) {
        handleError(res, error);
    }
};



export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server Error",
            success: false,
            error: error.message,
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { firstname, lastname, email, phoneNumber, bio, skills, organization, jobRole } = req.body;
        const file = req.file; // File can be resume (candidate) or logo (recruiter)
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        // Handle file upload (resume for candidate, logo for recruiter)
        if (file) {
            const fileKey = `${user.role === 'candidate' ? 'resumes' : 'logos'}/${Date.now()}_${file.originalname}`;
            const uploadParams = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: fileKey,
                Body: file.buffer,
                ContentType: file.mimetype,
            };
            await s3Client.send(new PutObjectCommand(uploadParams));
            if (user.role === 'candidate') {
                user.profile.resume = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
                user.profile.resumeOriginalName = file.originalname;
            } else if (user.role === 'recruiter') {
                user.profile.profilePhoto = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
            }
        }

        // Common fields for both roles
        if (firstname) user.firstname = firstname;
        if (lastname) user.lastname = lastname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = Number(phoneNumber) || user.phoneNumber;

        // Role-specific fields
        if (user.role === 'candidate') {
            if (bio) user.profile.bio = bio;
            if (skills) user.profile.skills = skills.split(',').map((skill) => skill.trim());
        } else if (user.role === 'recruiter') {
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

        return res.status(200).json({
            message: 'Profile updated successfully',
            user: userResponse,
            success: true,
        });
    } catch (error) {
        handleError(res, error);
    }
};
export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required", success: false });
        }

        const storedOtp = otpStore.get(email);
        if (!storedOtp || storedOtp.otp !== otp || Date.now() > storedOtp.expiration) {
            return res.status(400).json({ message: "Invalid or expired OTP", success: false });
        }

        otpStore.delete(email); // Clear OTP after verification
        return res.status(200).json({
            message: "Email verified successfully",
            success: true,
            email,
            isVerified: true,
        });
    } catch (error) {
        handleError(res, error);
    }
};


export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required", success: false });
        }

        const otp = generateOTP();
        const expiration = Date.now() + 10 * 60 * 1000; // 10 minutes
        otpStore.set(email, { otp, expiration });

        await sendEmail(email, "Verify Your Email", otp, "candidate"); // Default role
        return res.status(200).json({ message: "New OTP sent successfully", success: true });
    } catch (error) {
        handleError(res, error);
    }
};

// New: Request OTP for Login or Reset Password
export const requestOtp = async (req, res) => {
    try {
        const { email, role } = req.body;
        if (!email || !role) {
            return res.status(400).json({
                message: "Email and role are required",
                success: false,
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false,
            });
        }

        if (!user.isVerified) {
            return res.status(400).json({
                message: "Please verify your email first",
                success: false,
            });
        }

        const otp = generateOTP();
        const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.otp = otp;
        user.otpExpiration = otpExpiration;
        await user.save();

        const templatePath = path.resolve(__dirname, "../static", `${role.toLowerCase()}.html`);
        await sendEmail(email, "Your OTP for Login/Reset Password", otp, templatePath);

        return res.status(200).json({
            message: "OTP sent to your email",
            success: true,
        });
    } catch (error) {
        console.error("Request OTP error:", error);
        return res.status(500).json({
            message: "Server Error",
            success: false,
            error: error.message,
        });
    }
};

// New: Login with OTP
export const loginWithOtp = async (req, res) => {
    try {
        const { email, otp, role } = req.body;
        if (!email || !otp || !role) {
            return res.status(400).json({
                message: "Email, OTP, and role are required",
                success: false,
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false,
            });
        }

        if (!user.isVerified) {
            return res.status(400).json({
                message: "Please verify your email first",
                success: false,
            });
        }

        if (user.otp !== otp || new Date() > user.otpExpiration) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
                success: false,
            });
        }

        user.otp = null;
        user.otpExpiration = null;
        await user.save();

        const tokenData = {
            userId: user._id,
            role: user.role,
        };
        const token = await jwt.sign(tokenData, process.env.SCREAKET_KEY, {
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

        return res
            .status(200)
            .cookie("token", token, {
                maxAge: 1 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict",
            })
            .json({
                message: `Welcome back ${user.firstname}`,
                user: userResponse,
                success: true,
            });
    } catch (error) {
        console.error("Login with OTP error:", error);
        return res.status(500).json({
            message: "Server Error",
            success: false,
            error: error.message,
        });
    }
};

// New: Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword, role } = req.body;
        if (!email || !otp || !newPassword || !role) {
            return res.status(400).json({
                message: "Email, OTP, new password, and role are required",
                success: false,
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false,
            });
        }

        if (!user.isVerified) {
            return res.status(400).json({
                message: "Please verify your email first",
                success: false,
            });
        }

        if (user.otp !== otp || new Date() > user.otpExpiration) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpiration = null;
        await user.save();

        return res.status(200).json({
            message: "Password reset successfully",
            success: true,
        });
    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({
            message: "Server Error",
            success: false,
            error: error.message,
        });
    }
};