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
import connectDB from "./src/config/db.js";

connectDB();

const app = express();

// ✅ Environment Debug (Production-Friendly)
console.log(
  "OPENROUTER KEY 👉",
  process.env.OPENROUTER_API_KEY ? "LOADED ✅" : "NOT LOADED ❌",
);

// ✅ Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
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

// ✅ Global Error Handler (Professional touch)
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR 👉", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
