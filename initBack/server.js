import "dotenv/config";

import connectDB from "./config/db.js";

import researchWorker from "./controllers/workers/researchWorker.js";
import pitchWorker from "./controllers/workers/pitchWorker.js";
import roadmapWorker from "./controllers/workers/roadmapWorker.js";
import techStackWorker from "./controllers/workers/techStackWorker.js";
import validationWorker from "./controllers/workers/validationWorker.js";

const startWorkers = async () => {
  try {
    await connectDB();

    console.log("Worker server started");
    console.log("MongoDB connected");

    console.log("Research worker loaded");
    console.log("Pitch worker loaded");
    console.log("Roadmap worker loaded");
    console.log("Tech Stack worker loaded");
    console.log("Validation worker loaded");
  } catch (error) {
    console.error("Worker server failed to start:", error);

    process.exit(1);
  }
};

startWorkers();
