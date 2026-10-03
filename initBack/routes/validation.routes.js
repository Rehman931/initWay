// routes/validation.routes.js
import getValidation from "../controllers/getValidation.js";
import generateValidation from "../controllers/generateValidation.js";
import verifyToken from "../middleware/jwt.js";

import express from "express";

const router = express.Router();

router.post("/:projectId", verifyToken, generateValidation);

router.get("/:validationId", getValidation);

export default router;
