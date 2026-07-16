import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import healthRouter from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";

import { errorHandler } from "./middleware/errorHandler";
import { requestId } from "./middleware/requestId";

const app = express();

app.use(requestId);

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(cookieParser());

app.use("/api/v1/health", healthRouter);

app.use("/api/v1/auth", authRoutes);

// Always keep this LAST
app.use(errorHandler);

export default app;