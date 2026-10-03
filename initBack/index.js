import env from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import researchRoutes from "./routes/research.routes.js";
import validationRoutes from "./routes/validation.routes.js";
import pitchRoutes from "./routes/pitch.routes.js";
import roadmapRoutes from "./routes/roadmap.routes.js";
import techStackRoutes from "./routes/techstack.routes.js";
import connectDB from "./config/db.js";
import Dashverify from "./routes/dash.routes.js";
import statusVerify from "./routes/status.routes.js";
import reportStatus from "./routes/reportStatus.route.js";
import totalreports from "./routes/totalreports.routes.js";
env.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

connectDB();

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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
