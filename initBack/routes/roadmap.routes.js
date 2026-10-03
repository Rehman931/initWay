import getRoadmap from "../controllers/getRoadmap.js";
import generateRoadmap from "../controllers/generateRoadmap.js";
import verifyToken from "../middleware/jwt.js";

import express from "express";

const router = express.Router();

router.post("/:projectId", verifyToken, generateRoadmap);

router.get("/:roadmapId", getRoadmap);

export default router;
