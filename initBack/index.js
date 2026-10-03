import "dotenv/config";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import researchRoutes from "./routes/research.routes.js";
import validationRoutes from "./routes/validation.routes.js";
import pitchRoutes from "./routes/pitch.routes.js";
import roadmapRoutes from "./routes/roadmap.routes.js";
import techStackRoutes from "./routes/techstack.routes.js";

import Dashverify from "./routes/dash.routes.js";
import statusVerify from "./routes/status.routes.js";
import reportStatus from "./routes/reportStatus.route.js";
import totalreports from "./routes/totalreports.routes.js";

// Workers
import researchWorker from "./workers/researchWorker.js";
import pitchWorker from "./workers/pitchWorker.js";
import roadmapWorker from "./workers/roadmapWorker.js";
import techStackWorker from "./workers/techStackWorker.js";
import validationWorker from "./workers/validationWorker.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/verify", Dashverify);
app.use("/api/projects", projectRoutes);
app.use("/api/research", researchRoutes);
app.use("/api/validation", validationRoutes);
app.use("/api/pitch", pitchRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/techstack", techStackRoutes);
app.use("/api/verify", statusVerify);
app.use("/api/verify", reportStatus);
app.use("/api/report", totalreports);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect MongoDB once
    await connectDB();

    console.log("MongoDB connected");

    // Workers are already created when imported above.
    console.log("Research worker loaded");
    console.log("Pitch worker loaded");
    console.log("Roadmap worker loaded");
    console.log("Tech Stack worker loaded");
    console.log("Validation worker loaded");

    // Start API
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`API server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
};

startServer();
