import { Admin} from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken;
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId || !decoded.role) {
      return res.status(401).json({ success: false, message: "Invalid token structure" });
    }
    const admin = await Admin.findById(decoded.userId).select("_id role username email");
    if (!admin) {
      return res.status(401).json({ success: false, message: "Admin not found" });
    }
    if (admin.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied: Admin only" });
    }
    req.user = {
      id: admin._id,
      role: admin.role,
      username: admin.username,
      email: admin.email,
    };
    next();
  } catch (error) {
    console.error("Admin verification error:", { error, token: req.cookies.adminToken });
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    res.status(500).json({ success: false, message: "Server error during admin verification" });
  }
};