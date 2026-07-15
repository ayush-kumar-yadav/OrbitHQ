import mongoose from "mongoose";

import { logger } from "../utils/logger";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    logger.info("MongoDB Connected");
  } catch (error) {
    logger.error(error);

    process.exit(1);
  }
}