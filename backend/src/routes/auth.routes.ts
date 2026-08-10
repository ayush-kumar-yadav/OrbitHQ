import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { rateLimit } from "../middleware/rateLimit.middleware";

const router = Router();

router.post("/register",rateLimit(5, 60),authController.register);
router.post("/refresh", authController.refresh);
router.post("/login",rateLimit(5, 60),authController.login);
router.get("/me", authenticate, authController.me);
router.post("/logout", authenticate, authController.logout);
export default router;