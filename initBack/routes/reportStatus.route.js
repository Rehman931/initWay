import verifyDash from "../middleware/jwt.js";
import express from "express";
import reportStatus from "../controllers/authverification/reportStatus.js";
const router = express.Router();

router.post("/reportstatus", verifyDash, reportStatus);

export default router;
