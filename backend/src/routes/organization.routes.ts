import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import { organizationController } from "../controllers/organization.controller";

const router = Router();

// Create Organization
router.post(
  "/",
  authenticate,
  organizationController.createOrganization
);

export default router;