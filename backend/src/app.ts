import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import "express-async-errors";

import healthRouter from "./routes/health.routes";

import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(cookieParser());

app.use("/api/v1/health", healthRouter);

app.use(errorHandler);

export default app;