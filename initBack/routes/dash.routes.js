import dashboard from "../controllers/authverification/dashboard.js";
import verifyDash from "../middleware/jwt.js";

import express from "express";

const router = express.Router();

router.post("/dashboard", verifyDash, dashboard);

export default router;
