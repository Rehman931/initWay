// routes/auth.routes.js
import registerUser from "../controllers/registerUser.js";
import loginUser from "../controllers/loginUser.js";

import express from "express";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
