import express from "express";
import AIController from "../controller/ss.js";

const router = express.Router();

// ✅ POST /api/v2/chatbot/explain
router.post("/explain", AIController.explain);

export const Apirouter = router;
