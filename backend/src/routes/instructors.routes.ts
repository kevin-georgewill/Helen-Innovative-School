import { Router } from "express";
import { authenticateUser, requireRole } from "../middleware/auth";
import {
  getInstructorMe,
  getInstructors,
} from "../controllers/instructors.controller";
import { getInstructorDashboard } from "../controllers/instructorDashboard.controller";

const router = Router();

router.get("/", getInstructors);

router.get(
  "/me",
  authenticateUser,
  getInstructorMe
);
router.get(
  "/dashboard",
  authenticateUser,
  requireRole("instructor"),
  getInstructorDashboard
);
export default router;