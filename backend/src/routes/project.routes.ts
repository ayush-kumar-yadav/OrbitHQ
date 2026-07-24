import { Router } from "express";

import { projectController } from "../controllers/project.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";

import { UserRole } from "../constants/roles";

const router = Router();
router.post(
  "/",
  authenticate,
  authorize(
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER
  ),
  projectController.createProject
);
router.get(
  "/",
  authenticate,
  projectController.getAllProjects
);
router.get(
  "/:id",
  authenticate,
  projectController.getProjectById
);
export default router;
