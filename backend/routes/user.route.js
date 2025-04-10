import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
  verifyEmail,
  resendOTP,
  requestOtp,
  loginWithOtp,
  resetPassword,
  sendOtp, // New endpoint
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.route("/send-otp").post(sendOtp); // New: Send OTP for initial email verification
router.route("/register").post(upload.single("file"), register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, upload.single("file"), updateProfile);
router.route("/verify/otp").post(verifyEmail);
router.route("/reset-otp/otp").post(resendOTP);
router.route("/request-otp").post(requestOtp);
router.route("/login-otp").post(loginWithOtp);
router.route("/reset-password").post(resetPassword);

export default router;