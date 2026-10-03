import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if fields are provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // Find user
    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(404).json({
        message: "User not found. Please sign up first.",
      });
    }

    // Compare password with hashed password
    const passwordMatch = await bcrypt.compare(password, userExist.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        email: userExist.email,
        userId: userExist._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      },
    );

    return res.status(200).json({
      message: "Login successful.",
      token: token,
    });
  } catch (err) {
    console.error("Login error:", err);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export default loginUser;
