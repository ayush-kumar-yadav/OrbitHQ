import { Router } from "express";

import { taskController } from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";

import { UserRole } from "../constants/roles";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize(
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.DEVELOPER
  ),
  taskController.createTask
);

router.get(
  "/",
  authorize(
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.DEVELOPER,
    UserRole.VIEWER
  ),
  taskController.getAllTasks
);

router.get(
  "/:id",
  authorize(
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.DEVELOPER,
    UserRole.VIEWER
  ),
  taskController.getTaskById
);

router.put(
  "/:id",
  authorize(
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.DEVELOPER
  ),
  taskController.updateTask
);

router.patch(
  "/:id/assign",
  authorize(
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER
  ),
  taskController.assignTask
);

router.patch(
  "/:id/status",
  authorize(
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.DEVELOPER
  ),
  taskController.updateTaskStatus
);

router.delete(
  "/:id",
  authorize(
    UserRole.OWNER,
    UserRole.ADMIN
  ),
  taskController.deleteTask
);

export default router;