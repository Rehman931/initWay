import express from "express";

import registerUser from "../controllers/registerUser.js";
import loginUser from "../controllers/loginUser.js";
import checkUser from "../controllers/authverification/signUserExist.js";
import otpRateLimit from "../middleware/otpRateLimit.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post(
  "/userexist",
  otpRateLimit({
    limit: 3,
    windowSeconds: 15 * 60,
    prefix: "otp-limit",
  }),
  checkUser,
);

export default router;
