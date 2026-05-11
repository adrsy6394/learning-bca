import express from "express";
import { explainTopic, chatWithContext } from "../controller/ChatBot.controller.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Standard Explanation
router.post("/explain", explainTopic);

// ✅ RAG-based Query (Knowledge about website + User Context)
router.post("/query", protect, chatWithContext);

export const Apirouter = router;
