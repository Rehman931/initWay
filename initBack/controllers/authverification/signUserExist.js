import User from "../../models/User.js";
import crypto from "node:crypto";
import redis from "../../config/redis.js";
import bcrypt from "bcrypt";

const checkUser = async (req, res) => {
  try {
    // 1. Get signup details
    const { name, email, password } = req.body ?? {};

    // 2. Validate required fields
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({
        message: "Password must be between 8 and 128 characters.",
      });
    }

    const emailHashSecret = process.env.EMAIL_HASH_SECRET;

    if (!emailHashSecret) {
      throw new Error("EMAIL_HASH_SECRET is not configured.");
    }

    // 3. Normalize input
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // 4. Check whether the user already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists. Please log in.",
      });
    }

    // 5. Hash password before temporary storage
    const hashpass = await bcrypt.hash(password, 10);

    // 6. Generate an HMAC of the normalized email
    const emailHash = crypto
      .createHmac("sha256", emailHashSecret)
      .update(normalizedEmail)
      .digest("hex");

    // 7. Use only the hash as the registration ID.
    // completeSignup adds the "userPending-ID:" prefix.
    const pendingRegistrationID = emailHash;
    const redisKey = `userPending-ID:${pendingRegistrationID}`;

    // 8. Store pending signup for 15 minutes.
    // ioredis syntax: SET key value EX seconds
    await redis.set(
      redisKey,
      JSON.stringify({
        name: normalizedName,
        email: normalizedEmail,
        hashpass,
      }),
      "EX",
      900,
    );

    // 9. Return registration ID to frontend
    return res.status(200).json({
      message: "Pending registration created.",
      pendingRegistrationID,
    });
  } catch (err) {
    console.error("Check user error:", err);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export default checkUser;
