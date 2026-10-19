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

    if (!process.env.EMAIL_HASH_SECRET) {
      throw new Error("EMAIL_HASH_SECRET is not configured.");
    }

    // 3. Normalize the input
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // 4. Check whether the user already exists
    const userExist = await User.findOne({
      email: normalizedEmail,
    });

    if (userExist) {
      return res.status(409).json({
        message: "User already exists. Please log in.",
      });
    }

    // 5. Hash the password
    const hashpass = await bcrypt.hash(password, 10);

    // 6. Generate an HMAC from the email
    const emailHash = crypto
      .createHmac("sha256", process.env.EMAIL_HASH_SECRET)
      .update(normalizedEmail)
      .digest("hex");

    // 7. Use the email hash as the pending registration key
    const pendingRegistrationID = `userPending-ID:${emailHash}`;

    // 8. Check whether pending data already exists
    const findRedis = await redis.get(pendingRegistrationID);

    if (findRedis) {
      // Delete the previous pending signup
      await redis.del(pendingRegistrationID);
    }

    // 9. Store the new pending signup for five minutes
    await redis.set(
      pendingRegistrationID,
      JSON.stringify({
        name: normalizedName,
        email: normalizedEmail,
        hashpass,
      }),
      {
        EX: 900,
      },
    );

    // 10. Return the registration ID
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
