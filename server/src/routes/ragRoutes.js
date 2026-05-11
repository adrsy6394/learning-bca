import express from "express";
import { processSyllabusForRag, searchVectorContext, getRagStatus } from "../controller/ragController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only: Trigger the embedding process
router.post("/process", protect, admin, processSyllabusForRag);

// Status: Check how many chunks are embedded
router.get("/status", getRagStatus);

// Public/Protected: Test search
router.post("/search", protect, searchVectorContext);

export default router;
