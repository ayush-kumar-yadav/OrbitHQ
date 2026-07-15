import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,

    message: "OrbitHQ API Running",

    version: "v1"
  });
});

export default router;