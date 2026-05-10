import express from "express";
import { explainTopic, chatWithContext } from "../controller/ChatBot.controller.js";

const router = express.Router();

// ✅ Standard Explanation
router.post("/explain", explainTopic);

// ✅ RAG-based Query (Knowledge about website)
router.post("/query", chatWithContext);

export const Apirouter = router;
