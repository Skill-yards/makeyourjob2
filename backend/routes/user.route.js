import express from "express";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() }); 
 
const router = express.Router();

router.route("/register").post(upload.single('file'),register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated,upload.single('file'),updateProfile);

export default router;

