import { createClient, RedisClientType } from "redis";

class RedisService {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url:
        process.env.REDIS_URL ||
        "redis://localhost:6379",
    });

    this.client.on("connect", () => {
      console.log("🟡 Redis connecting...");
    });

    this.client.on("ready", () => {
      console.log("🟢 Redis ready");
    });

    this.client.on("error", (error) => {
      console.error("🔴 Redis error:", error);
    });

    this.client.on("end", () => {
      console.log("🔴 Redis connection closed");
    });
  }

  async connect() {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  async disconnect() {
    if (this.client.isOpen) {
      await this.client.quit();
    }
  }

  getClient() {
    return this.client;
  }

  isReady() {
    return this.client.isReady;
  }
}

export const redisService =
  new RedisService();