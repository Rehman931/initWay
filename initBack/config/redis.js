import "dotenv/config";
import IORedis from "ioredis";

const redis = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("ready", () => {
  console.log("✅ Redis ready");
});

redis.on("error", (error) => {
  console.error("❌ Redis error:", error.message);
});

export default redis;
