import express from "express";
// Re-touch for Vercel deployment sync
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllSyllabus,
  createSyllabus,
  updateSyllabus,
  deleteSyllabus,
  addAdmin,
  syncKnowledgeBase,
} from "../controller/adminController.js";

const router = express.Router();

// All routes below are protected and require admin privileges
router.use(protect, admin);

// Dashboard stats
router.get("/stats", getDashboardStats);

// User Management
router.route("/users")
  .get(getAllUsers);
  
router.post("/users/add-admin", addAdmin);
router.post("/sync-knowledge", syncKnowledgeBase);

router.route("/users/:id")
  .delete(deleteUser);
  
router.put("/users/:id/role", updateUserRole);

// Syllabus Management
router.route("/syllabus")
  .get(getAllSyllabus)
  .post(createSyllabus);
router.route("/syllabus/:id")
  .put(updateSyllabus)
  .delete(deleteSyllabus);

export default router;
