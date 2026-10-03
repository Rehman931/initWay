import verifyDash from "../middleware/jwt.js";
import projectStatus from "../controllers/authverification/projectStatus.js";
import express from "express";

const router = express.Router();

router.post("/status", verifyDash, projectStatus);

export default router;
