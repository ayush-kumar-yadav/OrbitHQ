import { Router } from "express";

import { projectController } from "../controllers/project.controller";
import { cacheMiddleware } from "../middleware/cache.middleware";
import { cacheKeys } from "../cache/cache.keys";
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
  cacheMiddleware(
    (req) => {
      const organizationId =
        req.user.organizationId;

      const page =
        Number(req.query.page) || 1;

      const limit =
        Number(req.query.limit) || 10;

      const search =
        req.query.search as string | undefined;

      const sort =
        req.query.sort as string | undefined;

      return cacheKeys.projects(
        organizationId!,
        page,
        limit,
        search,
        sort
      );
    },
    120
  ),
  projectController.getAllProjects
);
router.get(
  "/:id",
  authenticate,
  projectController.getProjectById
);
router.put(
  "/:id",
  authenticate,
  authorize(
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER
  ),
  projectController.updateProject
);
router.put(
  "/:id/archive",
  authenticate,
  authorize(
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER
  ),
  projectController.archiveProject
);

router.delete(
  "/:id",
  authenticate,
  authorize(
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER
  ),
  projectController.deleteProject
);
export default router;
