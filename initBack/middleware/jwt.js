import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("JWT ERROR:", error);

    return res.status(401).json({
      message: error.message,
    });
  }
};

export default verifyToken;
