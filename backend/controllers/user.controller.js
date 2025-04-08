import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../utils/file.upload.service.js";
import dotenv from "dotenv";
import { sendEmail } from "../utils/send.email.service.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};



export const register = async (req, res) => {
    try {
        const { firstname,lastname, email, phoneNumber, password, role,gender, isOtpVerified } = req.body;

        // Validate required fields based on registration phase
        if (!email || !firstname || !role) {
            return res.status(400).json({
                message: "Email, fullname, and role are required",
                success: false,
            });
        }

        // Phase 1: Initial registration with OTP
        if (!phoneNumber && !password && !isOtpVerified) {
            const existingUser = await User.findOne({ email }).lean();
            if (existingUser) {
                return res.status(400).json({
                    message: "User already exists with this email",
                    success: false,
                });
            }

            const otp = generateOTP();
            const otpExpiration = new Date(Date.now() + 60 * 60 * 1000);

            const newUser = await User.create({
                firstname,
                lastname,
                email,
                role,
                gender,
                otp,
                otpExpiration,
                isVerified: false,
            });

            const templatePath = path.resolve(
                __dirname,
                "../static",
                `${role.toLowerCase()}.html`
            );

            // Send email asynchronously without awaiting
            sendEmail(email, "Verification OTP", otp, templatePath).catch((error) => {
                console.error("Email sending failed:", error);
            });

            return res.status(200).json({
                message: "OTP sent to your email for verification",
                success: true,
                userId: newUser._id,
            });
        }

        // Phase 2: Complete registration after OTP verification
        if (isOtpVerified && phoneNumber && password) {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                    success: false,
                });
            }

            if (!user.isVerified) {
                return res.status(400).json({
                    message: "Please verify your email first",
                    success: false,
                });
            }

            // Process file upload if present
            let profilePhotoUrl = null;
            if (req.file) {
                const fileKey = `uploads/${Date.now()}_${req.file.originalname}`;
                const uploadParams = {
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: fileKey,
                    Body: req.file.buffer,
                    ContentType: req.file.mimetype,
                };

                await s3Client.send(new PutObjectCommand(uploadParams));
                profilePhotoUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
            }

            // Update user with optimized update operation
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.updateOne(
                { email },
                {
                    phoneNumber,
                    password: hashedPassword,
                    profile: { profilePhoto: profilePhotoUrl || "" },
                }
            );

            const updatedUser = await User.findOne({ email }).lean();

            return res.status(200).json({
                message: "Account updated successfully",
                success: true,
                user: updatedUser,
            });
        }

        return res.status(400).json({
            message: "Invalid request parameters",
            success: false,
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            message: "Server Error",
            success: false,
            error: error.message,
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false,
            });
        }

        const tokenData = {
            userId: user._id,
            role: user.role,
        };
        const token = await jwt.sign(tokenData, process.env.SCREAKET_KEY, {
            expiresIn: "1d",
        });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };

        return res
            .status(200)
            .cookie("token", token, {
                maxAge: 1 * 24 * 60 * 60 * 1000,
                httpsOnly: true,
                sameSite: "strict",
            })
            .json({
                message: `Welcome back ${user.fullname}`,
                user,
                success: true,
            });
    } catch (error) {
        console.log(error);
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
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;
        let resumeUrl = null;
        let resumeOriginalName = null;

        if (file) {
            const fileBuffer = file.buffer; // Get file buffer
            const fileKey = `resumes/${Date.now()}_${file.originalname}`; // Unique filename

            const uploadParams = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: fileKey,
                Body: fileBuffer,
                ContentType: file.mimetype,
            };

            await s3Client.send(new PutObjectCommand(uploadParams));
            resumeUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
            resumeOriginalName = file.originalname;
        }

        let skillsArray = skills ? skills.split(",") : [];
        const userId = req.id; // Extract user ID from middleware
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false,
            });
        }

        // Updating user fields
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;
        if (resumeUrl) {
            user.profile.resume = resumeUrl;
            user.profile.resumeOriginalName = resumeOriginalName;
        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile,
            },
            success: true,
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required",
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
        if (user.isVerified) {
            return res.status(400).json({
                message: "Email already verified",
                success: false,
            });
        }
        if (user.otp !== otp || new Date() > user.otpExpiration) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
                success: false,
            });
        }
        user.isVerified = true;
        user.otp = null;
        user.otpExpiration = null;
        await user.save();
        return res.status(200).json({
            message: "Email verified successfully",
            success: true,
        });
    } catch (error) {
        console.error("Error in verifyEmail:", error);
        return res.status(500).json({ message: "Server Error", success: false });
    }
};




export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
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

        if (user.isVerified) {
            return res.status(400).json({
                message: "Email already verified",
                success: false,
            });
        }

        const otp = generateOTP();
        const otpExpiration = new Date(Date.now() + 60 * 60 * 1000);

        console.log("Generated OTP Expiration:", otpExpiration);

        user.otp = otp;
        user.otpExpiration = otpExpiration;
        await user.save();

        console.log("Stored OTP Expiration:", user.otpExpiration);

        await sendEmail(email, otp);

        return res.status(200).json({
            message: "New OTP sent successfully",
            success: true,
        });
    } catch (error) {
        console.error("Error in resendOTP:", error);
        return res.status(500).json({ message: "Server Error", success: false });
    }
};