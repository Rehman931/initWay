import express from "express";
import verifyToken from "../middleware/jwt.js";

import getTotalprojects from "../controllers/getTotalprojects.js";

const router = express.Router();

// Get all projects of a user
router.get("/", verifyToken, getTotalprojects);

export default router;
