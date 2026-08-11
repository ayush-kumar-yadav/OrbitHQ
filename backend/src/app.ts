import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import commentRoutes from "./routes/comment.routes";
import activityRoutes from "./routes/activity.routes";
import healthRouter from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";
import organizationRoutes from "./routes/organization.routes";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";
import testQueueRoutes from "./routes/test.queue.routes";
import notificationRoutes from "./routes/notification.routes";

import { errorHandler } from "./middleware/errorHandler";
import { requestId } from "./middleware/requestId";
import { performanceMiddleware } from "./middleware/performance.middleware";
import dashboardRoutes from "./routes/dashboard.routes";


const app = express();

// Global Middleware
app.use(requestId);
app.use(performanceMiddleware);

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use(
  "/api/v1/notifications",
  notificationRoutes
);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/organizations", organizationRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1", commentRoutes);
app.use("/api/v1", activityRoutes);
app.use(
  "/api/v1",
  testQueueRoutes
);
// Error Handler (Always Last)
app.use(errorHandler);

export default app;