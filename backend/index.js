import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import contactRoute from "./routes/contact.route.js"

dotenv.config();

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: [
        "http://localhost:5173",
        "https://h11d8v8s-5173.inc1.devtunnels.ms/",
        "http://localhost:4173",
        "https://www.makeyourjobs.com",
        "https://makeyourjobs.com",
    ],
    credentials: true
};
app.use(cors(corsOptions));

// Disable caching globally to prevent 304 issues
app.use((req, res, next) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    next();
});

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/contact", contactRoute);

// Handle 404 for API routes
app.use("/api", (req, res) => {
    res.status(404).json({ error: "API route not found" });
});

// Serve frontend build files
const frontendBuildPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendBuildPath));

app.get("*", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
});

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Server Error",
    });
};
app.use(errorHandler);


// Start server only after DB connection
const PORT = process.env.PORT || 3000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at port ${PORT}`);
    });
}).catch(err => {
    console.error("❌ Database connection failed:", err);
});
