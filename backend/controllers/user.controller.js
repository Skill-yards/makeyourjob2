import asyncHandler from "express-async-handler";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../utils/file.upload.service.js";
import { sendEmail } from "../utils/send.email.service.js";
import path from "path";
import sanitizeHtml from "sanitize-html";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.AWS_S3_BUCKET_NAME, " s3 back name");

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

  res
    .status(200)
    .json({ success: true, message: "OTP sent to your email", otp });
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
  });
  res
    .status(200)
    .json({ success: true, message: "OTP sent to your email", otp });
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
  const requiredFields = [
    "email",
    "firstname",
    "role",
    "gender",
    "phoneNumber",
    "password",
  ];
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
    const fileKey = `uploads/${Date.now()}_profile${
      file.originalname ? path.extname(file.originalname) : ""
    }`;
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

  const token = jwt.sign(
    { userId: savedUser._id, role: savedUser.role },
    process.env.SCREAKET_KEY,
    {
      expiresIn: "1d",
    }
  );

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
    .cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    })
    .json({
      success: true,
      message: "Account registered successfully",
      user: userResponse,
    });
});

// Login
export const login = asyncHandler(async (req, res) => {
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

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

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
    .cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    })
    .json({
      success: true,
      message: `Welcome back ${user.firstname}`,
      user: userResponse,
    });
});
// Logout
export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});


export const updateProfile = asyncHandler(async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    phoneNumber,
    gender,
    bio,
    skills,
    organization,
    jobRole,
    employment,
    education,
    projects,
    onlineProfiles,
    certificates,
  } = req.body;

  const userId = req.id;
  const profilePhoto = req.files?.profilePhoto?.[0];
  const resumeFile = req.files?.file?.[0];
  console.log(req.body,"hello...")

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Sanitize inputs
  const sanitizedBio = bio
    ? sanitizeHtml(bio, { allowedTags: [], allowedAttributes: {} })
    : user.profile.bio;
  const sanitizedOrganization = organization
    ? sanitizeHtml(organization, { allowedTags: [], allowedAttributes: {} })
    : user.profile.organization;
  const sanitizedJobRole = jobRole
    ? sanitizeHtml(jobRole, { allowedTags: [], allowedAttributes: {} })
    : user.profile.jobRole;

  // Handle profile photo upload
  if (profilePhoto) {
    const fileKey = `profilePhotos/${user.role}/${Date.now()}_${
      profilePhoto.originalname
    }`;
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Body: profilePhoto.buffer,
      ContentType: profilePhoto.mimetype,
    };
    try {
      await s3Client.send(new PutObjectCommand(uploadParams));
      user.profile.profilePhoto = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
    } catch (error) {
      console.error("S3 upload error:", error);
      res.status(500);
      throw new Error("Failed to upload profile photo");
    }
  }

  // Handle resume upload for candidates
  if (user.role === "candidate" && resumeFile) {
    const fileKey = `resumes/${Date.now()}_${resumeFile.originalname}`;
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Body: resumeFile.buffer,
      ContentType: resumeFile.mimetype,
    };
    try {
      await s3Client.send(new PutObjectCommand(uploadParams));
      user.profile.resume = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
      user.profile.resumeOriginalName = resumeFile.originalname;
    } catch (error) {
      console.error("S3 upload error:", error);
      res.status(500);
      throw new Error("Failed to upload resume");
    }
  }

  // Update top-level fields
  user.firstname = firstname ? firstname.trim() : user.firstname;
  user.lastname = lastname ? lastname.trim() : user.lastname;
  user.email = email ? email.trim() : user.email;
  user.phoneNumber = phoneNumber ? phoneNumber.trim() : user.phoneNumber;
  user.gender = gender || user.gender;

  // Update profile fields
  if (user.role === "candidate") {
    user.profile.bio = sanitizedBio || user.profile.bio;
    user.profile.jobRole = sanitizedJobRole || user.profile.jobRole;

    // Parse and update skills
    let parsedSkills = user.profile.skills || [];
    try {
      if (typeof skills === "string" && skills.trim()) {
        if (skills.startsWith("[") && skills.endsWith("]")) {
          parsedSkills = JSON.parse(skills).map((skill) => skill.trim());
        } else {
          parsedSkills = skills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill !== "");
        }
      } else if (Array.isArray(skills)) {
        parsedSkills = skills.map((skill) => skill.trim()).filter((skill) => skill !== "");
      }
      user.profile.skills = parsedSkills;
    } catch (error) {
      console.error("Skills parsing error:", error);
      res.status(400);
      throw new Error("Invalid skills format");
    }

    // Helper function to parse nested arrays
    const parseNestedArray = (input, fieldName) => {
      try {
        if (typeof input === "string" && input.trim()) {
          return JSON.parse(input);
        } else if (Array.isArray(input)) {
          return input;
        }
        return []; // Default to empty array if input is invalid
      } catch (error) {
        console.error(`${fieldName} parsing error:`, error);
        throw new Error(`Invalid ${fieldName} format`);
      }
    };

    // Update nested arrays, relying on schema validation
    try {
      if (employment !== undefined) {
        user.profile.employment = parseNestedArray(employment, "employment");
      }
      if (education !== undefined) {
        user.profile.education = parseNestedArray(education, "education");
      }
      if (projects !== undefined) {
        user.profile.projects = parseNestedArray(projects, "projects");
      }
      if (onlineProfiles !== undefined) {
        user.profile.onlineProfiles = parseNestedArray(onlineProfiles, "onlineProfiles");
      }
      if (certificates !== undefined) {
        user.profile.certificates = parseNestedArray(certificates, "certificates");
      }
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  } else if (user.role === "recruiter") {
    user.profile.organization = sanitizedOrganization || user.profile.organization;
    user.profile.jobRole = sanitizedJobRole || user.profile.jobRole;
  }

  // Mark modified fields to ensure MongoDB updates nested arrays
  user.markModified("profile");

  // Save updated user
  try {
    await user.save();
  } catch (error) {
    console.error("Mongoose save error:", error);
    res.status(500);
    throw new Error("Failed to update profile details");
  }

  // Prepare response
  const userResponse = {
    _id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    gender: user.gender,
    isVerified: user.isVerified,
    profile: {
      bio: user.profile.bio,
      skills: user.profile.skills,
      resume: user.profile.resume,
      resumeOriginalName: user.profile.resumeOriginalName,
      profilePhoto: user.profile.profilePhoto,
      organization: user.profile.organization,
      jobRole: user.profile.jobRole,
      employment: user.profile.employment,
      education: user.profile.education,
      projects: user.profile.projects,
      onlineProfiles: user.profile.onlineProfiles,
      certificates: user.profile.certificates,
    },
  };

  res.status(200).json({
    success: true,
    message: "Profile details updated successfully",
    user: userResponse,
  });
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

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

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
    .cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    })
    .json({
      success: true,
      message: `Welcome back ${user.firstname}`,
      user: userResponse,
    });
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

  res
    .status(200)
    .json({ success: true, message: "Password reset successfully" });
});

export const subscribeGuestFromJobAlerts = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const subscription = await User.findOneAndUpdate(
      { email },
      { $set: { "subscription.isSubscribed": true } },
      { new: true }
    );
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.status(200).json({ message: "subscribed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//// create a funcation for the delete resumes
export const deleteResume = async (req, res) => {
  try {
    const { userId } = req.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user ID provided",
      });
    }
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (!user.resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found for this user",
      });
    }
    const updateResult = await User.findOneAndUpdate(
      { _id: userId },
      {
        $unset: { resume: 1 },
        $set: { updatedAt: new Date() },
      },
      {
        new: true,
        select: "_id email", // Return minimal data
      }
    );
    if (!updateResult) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete resume",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
      data: {
        userId: updateResult._id,
      },
    });
  } catch (error) {
    console.error("Delete resume error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting resume",
    });
  }
};
