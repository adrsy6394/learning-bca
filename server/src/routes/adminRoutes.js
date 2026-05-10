import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  updateUserRole,
  createSyllabus,
  updateSyllabus,
  deleteSyllabus,
} from "../controller/adminController.js";

const router = express.Router();

// All routes below are protected and require admin privileges
router.use(protect, admin);

// Dashboard stats
router.get("/stats", getDashboardStats);

// User Management
router.route("/users")
  .get(getAllUsers);
  
router.route("/users/:id")
  .delete(deleteUser);
  
router.put("/users/:id/role", updateUserRole);

// Syllabus Management
router.post("/syllabus", createSyllabus);
router.route("/syllabus/:id")
  .put(updateSyllabus)
  .delete(deleteSyllabus);

export default router;
