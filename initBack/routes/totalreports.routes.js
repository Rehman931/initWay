import totalReports from "../controllers/getTotalReports.js";
import express from "express";
import verifyToken from "../middleware/jwt.js";
const router = express.Router();

router.get("/history", verifyToken, totalReports);

export default router;
