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
router.post(
  "/invite",
  authenticate,
  authorize(UserRole.OWNER, UserRole.ADMIN),
  organizationController.inviteMember
);
router.get(
  "/me",
  authenticate,
  organizationController.getMyOrganization
);
router.get(
  "/members",
  authenticate,
  organizationController.getMembers
);

router.patch(
  "/members/:userId/role",
  authenticate,
  authorize(UserRole.OWNER),
  organizationController.updateMemberRole
);

router.delete(
  "/members/:userId",
  authenticate,
  authorize(UserRole.OWNER),
  organizationController.removeMember
);
export default router;