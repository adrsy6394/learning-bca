import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
  analyzePerformance, 
  generateStudyPlan, 
  analyzeCustomPerformance, 
  generateFlashcardAnswer,
  executeCode,
  explainCode
} from "../controller/aiController.js";

const router = express.Router();

router.post("/analyze", protect, analyzePerformance);
router.post("/analyze-custom", protect, analyzeCustomPerformance);
router.post("/generate-plan", protect, generateStudyPlan);
router.post("/flashcard-answer", protect, generateFlashcardAnswer);
router.post("/execute-code", protect, executeCode);
router.post("/explain-code", protect, explainCode);

export default router;
