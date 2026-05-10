import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { analyzePerformance, generateStudyPlan, analyzeCustomPerformance, generateFlashcardAnswer } from "../controller/aiController.js";

const router = express.Router();

router.post("/analyze", protect, analyzePerformance);
router.post("/analyze-custom", protect, analyzeCustomPerformance);
router.post("/generate-plan", protect, generateStudyPlan);
router.post("/flashcard-answer", protect, generateFlashcardAnswer);

export default router;
