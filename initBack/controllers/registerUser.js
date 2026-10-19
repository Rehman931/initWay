import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redis from "../config/redis.js";
import supabase from "../config/supabase.js";

const completeSignup = async (req, res) => {
  try {
    const { pendingRegistrationID } = req.body;

    const authHeader = req.headers.authorization;

    if (!pendingRegistrationID) {
      return res.status(400).json({
        message: "Pending registration ID is required.",
      });
    }

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Supabase access token is required.",
      });
    }

    const accessToken = authHeader.split(" ")[1];

    // 1. Verify the Supabase access token
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data.user || !data.user.email) {
      return res.status(401).json({
        message: "Invalid or expired Supabase session.",
      });
    }

    // 2. Get the verified email
    const verifiedEmail = data.user.email.trim().toLowerCase();

    // 3. Retrieve pending signup from Redis
    const redisKey = `userPending-ID:${pendingRegistrationID}`;

    const pendingData = await redis.get(redisKey);

    if (!pendingData) {
      return res.status(400).json({
        message: "Signup expired. Please register again.",
      });
    }

    const pendingSignup = JSON.parse(pendingData);

    // 4. Ensure the verified email matches the signup email
    if (pendingSignup.email !== verifiedEmail) {
      return res.status(403).json({
        message: "Verified email does not match signup email.",
      });
    }

    // 5. Check MongoDB again
    const existingUser = await User.findOne({
      email: verifiedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists. Please log in.",
      });
    }

    // 6. Create the MongoDB user
    // The password is already hashed in Redis.
    const user = await User.create({
      name: pendingSignup.name,
      email: verifiedEmail,
      password: pendingSignup.hashpass,
    });

    // 7. Create YOUR InitWay JWT
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      },
    );

    // 8. Delete temporary signup data
    await redis.del(redisKey);

    // 9. Return your app's JWT
    return res.status(201).json({
      message: "Email verified and user registered successfully.",
      token,
    });
  } catch (err) {
    console.error("Complete signup error:", err);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export default completeSignup;
