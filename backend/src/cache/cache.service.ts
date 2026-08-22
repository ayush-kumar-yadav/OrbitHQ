import { redisService } from "./redis.service";

class CacheService {
  async get<T>(key: string): Promise<T | null> {
    const redis = redisService.getClient();

    const value = await redis.get(key);

    if (!value) {
      console.log(`❌ Cache MISS: ${key}`);
      return null;
    }

    console.log(`✅ Cache HIT: ${key}`);

    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(
        `❌ Cache JSON parse error: ${key}`,
        error
      );

      await redis.del(key);

      return null;
    }
  }

  async set(
    key: string,
    value: unknown,
    ttl: number = 300
  ): Promise<void> {
    const redis = redisService.getClient();

    await redis.set(
      key,
      JSON.stringify(value),
      {
        EX: ttl,
      }
    );

    console.log(
      `💾 Cache SET: ${key} (${ttl}s)`
    );
  }

  async del(key: string): Promise<void> {
    const redis = redisService.getClient();

    await redis.del(key);

    console.log(
      `🗑️ Cache DELETE: ${key}`
    );
  }

  async delPattern(
    pattern: string
  ): Promise<void> {
    const redis = redisService.getClient();

    const keys: string[] = [];

    for await (const key of redis.scanIterator({
      MATCH: pattern,
      COUNT: 100,
    })) {
      // The redis v6 client's scanIterator can yield Buffer-typed
      // keys depending on the client's reply type mapping, not only
      // strings. The previous `typeof key === "string"` check
      // silently dropped every Buffer result — meaning this method
      // matched zero keys and deleted nothing, every single time,
      // across every caller (task/project create, update, delete,
      // assign...). String(key) coerces either shape correctly.
      keys.push(String(key));
    }

    if (keys.length === 0) {
      console.log(
        `🗑️ No cache keys found for: ${pattern}`
      );
      return;
    }

    await redis.del(keys);

    console.log(
      `🗑️ Cache pattern deleted: ${pattern} (${keys.length} key${keys.length === 1 ? "" : "s"})`
    );
  }

  async exists(
    key: string
  ): Promise<boolean> {
    const redis = redisService.getClient();

    const result = await redis.exists(key);

    return result === 1;
  }
}

export const cacheService =
  new CacheService();