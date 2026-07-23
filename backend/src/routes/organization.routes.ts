import { Router } from "express";
import { authorize } from "../middleware/authorize.middleware";
import { UserRole } from "../constants/roles";
import { authenticate } from "../middleware/auth.middleware";
import { organizationController } from "../controllers/organization.controller";

const router = Router();

// Create Organization
router.post(
  "/",
  authenticate,
  authorize(UserRole.OWNER),
  organizationController.createOrganization
);

export default router;