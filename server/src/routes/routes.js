import express from "express";
import { explainTopic, chatWithContext } from "../controller/ChatBot.controller.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Standard Explanation
router.post("/explain", explainTopic);

// ✅ Simple AI Chatbot
router.post("/query", protect, chatWithContext);

export const Apirouter = router;
