import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
  verifyEmail,
  loginWithOtp,
  resetPassword,
  sendOtp,
  sendOtpForRegister,
  subscribeGuestFromJobAlerts
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import multer from "multer";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2, // Limit each IP to 2 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "profilePhoto" && !file.mimetype.startsWith("image/")) {
      return cb(new Error("Profile photo must be an image"));
    }
    if (file.fieldname === "file" && file.mimetype !== "application/pdf") {
      return cb(new Error("Resume must be a PDF"));
    }
    cb(null, true);
  },
});

// Multer configuration for updateProfile (handles multiple fields)
const updateProfileUpload = upload.fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "file", maxCount: 1 },
]);

// Multer configuration for register (single file)
const registerUpload = upload.single("file");

const router = express.Router();

router.route("/send-otp-register").post(sendOtpForRegister);
router.route("/send-otp").post(sendOtp);
router.route("/register").post(registerUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, updateProfileUpload, updateProfile);
router.route("/verify/otp").post(verifyEmail);
router.route("/login-otp").post(loginWithOtp);
router.route("/reset-password").post(resetPassword);
router.post("/subscribe", subscribeGuestFromJobAlerts);

export default router;