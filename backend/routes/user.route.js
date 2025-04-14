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
  sendOtpForRegister
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import multer from "multer";
import rateLimit from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.route("/send-otp-register").post( sendOtpForRegister);
router.route("/send-otp").post(sendOtp);
router.route("/register").post(upload.single("file"), register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, upload.single("file"), updateProfile);
router.route("/verify/otp").post(verifyEmail);
router.route("/login-otp").post(loginWithOtp);
router.route("/reset-password").post(resetPassword);

export default router;