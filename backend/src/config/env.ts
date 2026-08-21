import { cleanEnv, port, str } from "envalid";

export const env = cleanEnv(process.env, {
  PORT: port(),
  NODE_ENV: str(),
  MONGO_URI: str(),
  REDIS_URL: str(),

  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),

  // Origin allowed to make CORS/socket requests to this API. Was
  // previously hardcoded to localhost in both app.ts and
  // socket.server.ts, which silently blocks every request once the
  // frontend is deployed anywhere else. Defaults to the local Vite
  // dev server so existing .env files without this var still work.
  CLIENT_URL: str({ default: "http://localhost:5173" }),
});