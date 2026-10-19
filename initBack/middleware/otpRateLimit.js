import crypto from "node:crypto";
import redis from "../config/redis.js";

const otpRateLimit = ({
  limit = 3,
  windowSeconds = 15 * 60,
  prefix = "otp-limit",
} = {}) => {
  return async (req, res, next) => {
    try {
      const email = req.body?.email;

      if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({
          message: "A valid email is required.",
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Avoid storing raw email addresses in Redis keys.
      const emailHash = crypto
        .createHmac("sha256", process.env.EMAIL_HASH_SECRET)
        .update(normalizedEmail)
        .digest("hex");

      const key = `${prefix}:${emailHash}`;

      // Increment request count.
      const count = await redis.incr(key);

      // Start the expiry window on the first request.
      if (count === 1) {
        await redis.expire(key, windowSeconds);
      }

      const ttl = await redis.ttl(key);

      res.setHeader("X-RateLimit-Limit", limit);
      res.setHeader("X-RateLimit-Remaining", Math.max(0, limit - count));

      if (count > limit) {
        res.setHeader("Retry-After", Math.max(ttl, 1));

        return res.status(429).json({
          message: "Too many OTP requests. Please try again later.",
          retryAfter: Math.max(ttl, 1),
        });
      }

      next();
    } catch (error) {
      console.error("OTP rate limit error:", error);

      // Fail closed: don't send OTP if the rate limiter fails.
      return res.status(503).json({
        message: "OTP service is temporarily unavailable. Please try again.",
      });
    }
  };
};

export default otpRateLimit;
