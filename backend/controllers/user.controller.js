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

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

const validateRequiredFields = (fields, required) => {
  for (const field of required) {
    if (!fields[field]) return false;
  }
  return true;
};

const handleError = (res, error, defaultMessage = "Server Error") => {
  console.error(`${error.stack || error.message}`);
  return res.status(500).json({ message: defaultMessage, success: false, error: error.message });
};

export const register = async (req, res) => {
  try {
    const { firstname, lastname, email, phoneNumber, password, role, gender, isOtpVerified, organization, jobRole } = req.body;
    const file = req.file;

    console.log("Request body:", req.body);
    console.log("Uploaded file:", file);

    const requiredFields = !isOtpVerified ? ["email", "firstname", "role", "gender"] : ["email", "firstname", "role", "gender", "phoneNumber", "password"];
    if (!validateRequiredFields({ firstname, lastname, email, phoneNumber, password, role, gender }, requiredFields)) {
      return res.status(400).json({ message: `All ${requiredFields.join(", ")} are required`, success: false });
    }

    const isVerifiedOtp = isOtpVerified === "true" || isOtpVerified === true;
    const existingUser = await User.findOne({ email });

    if (!isVerifiedOtp) {
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email", success: false });
      }

      const otp = generateOTP();
      const otpExpiration = new Date(Date.now() + 60 * 60 * 1000);

      const newUser = await User.create({
        firstname,
        lastname: lastname || "",
        email,
        phoneNumber: phoneNumber || "",
        role,
        gender,
        otp,
        otpExpiration,
        isVerified: false,
        profile: { organization: organization || "", jobRole: jobRole || "" },
      });

      const templatePath = path.resolve(__dirname, "../static", "welcome.html");
      const roleText = role.toLowerCase();
      const roleAction = role === "candidate" ? "explore job opportunities tailored for you" : "find talented candidates";
      const roleFeatures = role === "candidate" ? "browse jobs, apply directly, and track your applications in real-time" : "post jobs and manage applications";
      let htmlContent = await fs.readFile(templatePath, "utf-8");
      htmlContent = htmlContent
        .replace("{{ROLE}}", roleText.charAt(0).toUpperCase() + roleText.slice(1))
        .replace("{{ROLE_ACTION}}", roleAction)
        .replace("{{ROLE_FEATURES}}", roleFeatures)
        .replace("{{OTP}}", otp);
      await sendEmail(email, "Verification OTP", otp, null, htmlContent);

      return res.status(200).json({ message: "OTP sent to your email for verification", success: true, userId: newUser._id });
    }

    if (isVerifiedOtp) {
      if (!phoneNumber || !password) {
        return res.status(400).json({ message: "Phone number and password are required to complete registration", success: false });
      }

      let user = existingUser || new User({
        firstname,
        lastname: lastname || "",
        email,
        phoneNumber: phoneNumber || "",
        role,
        gender,
        isVerified: true,
        profile: { organization: organization || "", jobRole: jobRole || "" },
      });
      let isNewUser = !existingUser;

      if (!user.isVerified && !isNewUser) {
        return res.status(400).json({ message: "Please verify your email first", success: false });
      }

      let profilePhotoUrl = user.profile?.profilePhoto || "";
      if (file) {
        const fileExtension = path.extname(file.originalname);
        const fileKey = `uploads/${Date.now()}_profile${fileExtension}`;
        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        await s3Client.send(new PutObjectCommand(uploadParams));
        profilePhotoUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const phoneNumberAsNumber = Number(phoneNumber);
      if (isNaN(phoneNumberAsNumber)) {
        return res.status(400).json({ message: "Invalid phone number format", success: false });
      }

      user.phoneNumber = phoneNumberAsNumber;
      user.password = hashedPassword;
      user.profile = {
        ...user.profile,
        profilePhoto: profilePhotoUrl,
        organization: organization || user.profile?.organization || "",
        jobRole: jobRole || user.profile?.jobRole || "",
      };

      const savedUser = await user.save();

      const tokenData = { userId: savedUser._id, role: savedUser.role };
      const token = await jwt.sign(tokenData, process.env.SCREAKET_KEY, { expiresIn: "1d" });

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
        .status(200)
        .cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })
        .json({ message: "Account registered successfully", success: true, user: userResponse });
    }
  } catch (error) {
    handleError(res, error);
  }
};

export const login = async (req, res) => {
    try {
      const { email, password, role } = req.body;
      if (!validateRequiredFields({ email, password, role }, ["email", "password", "role"])) {
        return res.status(400).json({ message: "Email, password, and role are required", success: false });
      }
  
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password)) || role !== user.role || !user.isVerified) {
        return res.status(400).json({ message: "Incorrect email, password, role, or unverified email.", success: false });
      }
  
      const tokenData = { userId: user._id, role: user.role };
      const token = await jwt.sign(tokenData, process.env.SCREAKET_KEY, { expiresIn: "1d" });
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
        .cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })
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
        const { firstname, lastname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;
        let resumeUrl = null;
        let resumeOriginalName = null;

        if (file) {
            const fileBuffer = file.buffer;
            const fileKey = `resumes/${Date.now()}_${file.originalname}`;

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
        const userId = req.id; // From isAuthenticated middleware
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false,
            });
        }

        if (firstname) user.firstname = firstname;
        if (lastname) user.lastname = lastname;
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
                firstname: user.firstname,
                lastname: user.lastname,
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
            user: {
                role: user.role,
                _id: user._id,
                email: user.email,
            }
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

        user.otp = otp;
        user.otpExpiration = otpExpiration;
        await user.save();

        const templatePath = path.resolve(__dirname, "../static", `${user.role.toLowerCase()}.html`);
        await sendEmail(email, "Verification OTP", otp, templatePath);

        return res.status(200).json({
            message: "New OTP sent successfully",
            success: true,
        });
    } catch (error) {
        console.error("Error in resendOTP:", error);
        return res.status(500).json({ message: "Server Error", success: false });
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