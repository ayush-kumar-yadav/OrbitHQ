import { cleanEnv, port, str } from "envalid";

export const env = cleanEnv(process.env, {
  PORT: port(),

  NODE_ENV: str(),

  MONGO_URI: str(),

  REDIS_URL: str(),

  JWT_SECRET: str(),

  JWT_REFRESH_SECRET: str()
});