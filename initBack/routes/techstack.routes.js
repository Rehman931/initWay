import generateTechStack from "../controllers/generateTechStack.js";
import getTechStack from "../controllers/getTechStack.js";
import verifyToken from "../middleware/jwt.js";

import express from "express";

const router = express.Router();

router.post("/:projectId", verifyToken, generateTechStack);

router.get("/:techstackId", getTechStack);

export default router;
