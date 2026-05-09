import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProgress,
  googleLogin,
} from "../controller/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.get("/profile", protect, getUserProfile);
router.put("/progress", protect, updateUserProgress);

export default router;
