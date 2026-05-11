import dotenv from "dotenv";
dotenv.config(); // ✅ Load environment variables first

import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Apirouter } from "./src/routes/routes.js";
import authRoutes from "./src/routes/authRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";
import syllabusRoutes from "./src/routes/syllabusRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import connectDB from "./src/config/db.js";

connectDB().then(() => console.log("Database connected successfully"));

const app = express();

// 1. ✅ STANDARD CORS
app.use(cors({
  origin: function(origin, callback) {
    // Allow any Vercel domain for now to debug
    if (!origin || origin.endsWith(".vercel.app") || origin.includes("localhost")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"]
}));

// ✅ Environment Debug (Production-Friendly)
console.log(
  "OPENROUTER KEY 👉",
  process.env.OPENROUTER_API_KEY ? "LOADED ✅" : "NOT LOADED ❌",
);

// 2. ✅ Other Middlewares
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Health Check Route (Better for debugging)
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running 🚀",
    provider: process.env.OPENROUTER_API_KEY
      ? "OpenRouter Connected"
      : "No AI Provider Configured",
  });
});

// ✅ API Routes
app.use("/api/v2/chatbot", Apirouter);
app.use("/api/v2/auth", authRoutes);
app.use("/api/v2/ai", aiRoutes);
app.use("/api/v2/syllabus", syllabusRoutes);
app.use("/api/v2/admin", adminRoutes);

// ✅ Global Error Handler (Professional touch)
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR 👉", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

// ✅ Start Server (local dev only)
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

// ✅ Export for Vercel Serverless
export default app;
