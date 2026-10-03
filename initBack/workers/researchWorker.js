import "dotenv/config";
import axios from "axios";
import { Worker } from "bullmq";

import Project from "../models/Project.js";
import Internet from "../models/Internet.js";
import User from "../models/User.js";

const FLASK_URL = process.env.FLASK_URL;

if (!FLASK_URL) {
  throw new Error("FLASK_URL is not defined.");
}

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined.");
}

const researchWorker = new Worker(
  "research",

  async (job) => {
    console.log("=================================");
    console.log("Research job received:", job.id);
    console.log("=================================");

    const {
      projectId,
      userId,
      projectName,
      problem,
      targetCustomer,
      currentSolution,
      proposedSolution,
      evidence,
    } = job.data;

    // -----------------------------------------
    // 1. Validate job data
    // -----------------------------------------

    if (!projectId) {
      throw new Error("Project ID is missing.");
    }

    if (!userId) {
      throw new Error("User ID is missing.");
    }

    if (!projectName) {
      throw new Error("Project name is missing.");
    }

    if (!problem) {
      throw new Error("Problem is missing.");
    }

    if (!targetCustomer) {
      throw new Error("Target customer is missing.");
    }

    if (!proposedSolution) {
      throw new Error("Proposed solution is missing.");
    }

    // -----------------------------------------
    // 2. Find project
    // -----------------------------------------

    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error(`Project ${projectId} does not exist.`);
    }

    // -----------------------------------------
    // 3. Verify project belongs to user
    // -----------------------------------------

    if (project.userId.toString() !== userId.toString()) {
      throw new Error("Project does not belong to this user.");
    }

    // -----------------------------------------
    // 4. Prepare startup context
    // -----------------------------------------

    const startupContext = {
      projectName,
      problem,
      targetCustomer,
      currentSolution: currentSolution || "Not provided",
      proposedSolution,
      evidence: evidence || "Not provided",
    };

    const requestData = {
      constantquest: startupContext,
    };

    console.log("Sending research request to Flask...");
    console.log("Flask URL:", FLASK_URL);

    // -----------------------------------------
    // 5. Call Flask
    // -----------------------------------------

    let response;

    try {
      response = await axios.post(`${FLASK_URL}/research`, requestData, {
        timeout: 180000,

        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Flask research response:", response.status);
    } catch (error) {
      console.error("=================================");
      console.error("FLASK RESEARCH ERROR");
      console.error("=================================");

      console.error("STATUS:", error.response?.status);

      console.error("DATA:", error.response?.data);

      console.error("MESSAGE:", error.message);

      // Preserve the actual Flask error
      const status = error.response?.status;

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "AI research service failed.";

      if (status === 429) {
        throw new Error(
          "AI research service rate limit reached. Please try again later.",
        );
      }

      throw new Error(message);
    }

    // -----------------------------------------
    // 6. Validate Flask response
    // -----------------------------------------

    const aiData = response.data;

    if (!aiData) {
      throw new Error("Flask returned an empty response.");
    }

    if (!aiData.internetdata) {
      throw new Error("AI returned no internet research data.");
    }

    // -----------------------------------------
    // 7. Save internet research
    // -----------------------------------------

    await Internet.findOneAndUpdate(
      {
        projectId,
      },

      {
        projectId,
        internetData: aiData.internetdata,
      },

      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    console.log("Internet research saved:", projectId);

    // -----------------------------------------
    // 8. Mark project initialized
    // -----------------------------------------

    await Project.findByIdAndUpdate(projectId, {
      status: "initialized",
    });

    console.log("Project initialized:", projectId);

    // -----------------------------------------
    // 9. Return result
    // -----------------------------------------

    return {
      success: true,
      projectId,
      data: aiData,
    };
  },

  {
    connection: {
      url: process.env.REDIS_URL,
    },

    // Only one research job at a time
    concurrency: 1,
  },
);

// -----------------------------------------
// Completed
// -----------------------------------------

researchWorker.on("completed", (job) => {
  console.log(`Research job ${job.id} completed successfully.`);
});

// -----------------------------------------
// Failed
// -----------------------------------------

researchWorker.on("failed", async (job, error) => {
  if (!job) {
    console.error("Research job failed:", error.message);

    return;
  }

  console.error(`Research job ${job.id} failed:`, error.message);

  try {
    // Mark project failed
    await Project.findByIdAndUpdate(job.data.projectId, {
      status: "failed",
    });

    // Refund one chance
    await User.findByIdAndUpdate(job.data.userId, {
      $inc: {
        totalChances: 1,
      },
    });

    console.log(`Chance refunded for user ${job.data.userId}`);
  } catch (refundError) {
    console.error("Failed to mark project failed/refund chance:", refundError);
  }
});

// -----------------------------------------
// Worker error
// -----------------------------------------

researchWorker.on("error", (error) => {
  console.error("Research worker error:", error);
});

console.log("Research worker loaded");

export default researchWorker;
