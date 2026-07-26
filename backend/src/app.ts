import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import healthRouter from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";
import organizationRoutes from "./routes/organization.routes";
import projectRoutes from "./routes/project.routes";
import { errorHandler } from "./middleware/errorHandler";
import { requestId } from "./middleware/requestId";

const app = express();

app.use(requestId);

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));
import taskRoutes from "./routes/task.routes";
app.use("/api/v1/tasks", taskRoutes);
app.use(express.json());

app.use(cookieParser());

app.use("/api/v1/health", healthRouter);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/organizations", organizationRoutes);
app.use("/api/v1/projects", projectRoutes);

// Always keep this LAST
app.use(errorHandler);
export default app;