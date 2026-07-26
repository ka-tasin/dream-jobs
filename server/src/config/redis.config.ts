import { ConnectionOptions } from "bullmq";

const rawConnection = process.env.REDIS_URL || process.env.REDIS_HOST || "";

function getRedisOptions(): ConnectionOptions {
  if (rawConnection.includes("://")) {
    try {
      const parsed = new URL(rawConnection);
      return {
        host: parsed.hostname,
        port: Number(parsed.port) || 6379,
        username: parsed.username ? decodeURIComponent(parsed.username) : undefined,
        password: parsed.password ? decodeURIComponent(parsed.password) : undefined,
        tls: parsed.protocol === "rediss:" ? { rejectUnauthorized: false } : undefined,
        maxRetriesPerRequest: null,
      };
    } catch (err) {
      console.error("[Redis Config] Failed to parse Redis connection string:", err);
    }
  }

  return {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
  };
}

export const redisConnectionOptions: ConnectionOptions = getRedisOptions();