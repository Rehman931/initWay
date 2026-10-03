import express from "express";
import researchInternet from "../controllers/researchInternet.js";
import verifyToken from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, researchInternet);

export default router;
