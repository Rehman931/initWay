import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    // Check if user already exists
    const findUser = await User.findOne({ email });

    if (findUser) {
      return res.status(409).json({
        message: "User already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const createUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await createUser.save();

    const token = jwt.sign(
      {
        email: createUser.email,
        userId: createUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      },
    );

    return res.status(201).json({
      message: "User registered successfully.",
      token: token,
    });
  } catch (err) {
    console.error("Registration error:", err);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export default registerUser;
