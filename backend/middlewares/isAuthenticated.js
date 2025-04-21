import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    // Verify token with correct secret key
    const decoded = jwt.verify(token, process.env.SCREAKET_KEY); // Fixed typo

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    // Attach user data to request
    req.user = {
      id: decoded.userId,
      role: decoded.role, // also passing role from token
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      message: "Authentication failed due to server error",
      success: false,
    });
  }
};

export default isAuthenticated;
