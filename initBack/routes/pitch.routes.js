// routes/pitch.routes.js
import getPitch from "../controllers/getPitch.js";
import generatePitch from "../controllers/generatePitch.js";
import verifyToken from "../middleware/jwt.js";
import express from "express";

const router = express.Router();

router.post("/:projectId", verifyToken, generatePitch);

router.get("/:pitchId", getPitch);

export default router;
