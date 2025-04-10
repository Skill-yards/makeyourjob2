import express from "express";
import { login, logout, register, updateProfile ,verifyEmail,resendOTP, changePassword,forgetPassword,loginWithOtp } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() }); 
 
const router = express.Router();

router.route("/register").post(upload.single('file'),register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated,upload.single('file'),updateProfile);
router.route("/verify/otp").post(verifyEmail);
router.route("/reset-otp/otp").post(resendOTP);
/// create route for the changing password
router.route("/change-password").post(isAuthenticated, changePassword);
/// create route for the forget password
router.route("/forget-password").post(forgetPassword );
//// create route for the login with otp
router.route("/login-with-otp").post(loginWithOtp);


export default router;

