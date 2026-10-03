import "dotenv/config";

import axios from "axios";
import { Worker } from "bullmq";

import Roadmap from "../models/Roadmap.js";
import Project from "../models/Project.js";
import Internet from "../models/Internet.js";
import User from "../models/User.js";

const roadmapWorker = new Worker(
  "roadmap",

  async (job) => {
    console.log("Roadmap job received:", job.id);

    const { roadmapId, projectId, userId } = job.data;

    // 1. Validate job data

    if (!roadmapId || !projectId || !userId) {
      throw new Error("Roadmap ID, Project ID, or User ID is missing.");
    }

    // 2. Find roadmap

    const roadmap = await Roadmap.findById(roadmapId);

    if (!roadmap) {
      throw new Error(`Roadmap ${roadmapId} does not exist.`);
    }

    // 3. Find project

    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error(`Project ${projectId} does not exist.`);
    }

    // 4. Verify project belongs to user

    if (project.userId.toString() !== userId) {
      throw new Error("Project does not belong to this user.");
    }

    // 5. Find internet research

    const internet = await Internet.findOne({
      projectId,
    });

    if (!internet) {
      throw new Error(
        `Internet research does not exist for project ${projectId}.`,
      );
    }

    // 6. Call Flask AI service

    let response;

    try {
      response = await axios.post(
        `${process.env.FLASK_URL}/agents`,
        {
          constantquest: {
            projectName: project.projectName,
            problem: project.problem,
            targetCustomer: project.targetCustomer,
            currentSolution: project.currentSolution,
            proposedSolution: project.proposedSolution,
            evidence: project.evidence,
          },

          feature: "roadmap",

          featureInput: {},

          internetdata: internet.internetData,
        },
        {
          timeout: 120000,
        },
      );
    } catch (flaskError) {
      console.error(
        "Flask roadmap request failed:",
        flaskError.response?.data || flaskError.message,
      );

      throw new Error("AI roadmap service failed.");
    }

    // 7. Get AI response

    const aiData = response.data;

    // 8. Validate AI response

    if (!aiData?.output) {
      throw new Error("AI returned no roadmap output.");
    }

    // 9. Save roadmap

    await Roadmap.findByIdAndUpdate(
      roadmapId,
      {
        status: "completed",
        roadmapReport: aiData.output,
      },
      {
        new: true,
      },
    );

    console.log("Roadmap generation completed:", roadmapId);

    // 10. Return result to BullMQ

    return {
      success: true,
      roadmapId,
      projectId,
      data: aiData,
    };
  },

  {
    connection: {
      url: process.env.REDIS_URL,
    },

    concurrency: 2,
  },
);

// Job completed

roadmapWorker.on("completed", (job) => {
  console.log(`Roadmap job ${job.id} completed`);
});

// Job failed

roadmapWorker.on("failed", async (job, error) => {
  if (!job) {
    console.error("Roadmap job failed:", error.message);

    return;
  }

  console.error(`Roadmap job ${job.id} failed:`, error.message);

  // BullMQ retries automatically.
  // Refund only after the final attempt.

  const attemptsMade = job.attemptsMade;

  const maxAttempts = job.opts.attempts || 1;

  if (attemptsMade >= maxAttempts) {
    try {
      // Mark roadmap as failed

      await Roadmap.findByIdAndUpdate(job.data.roadmapId, {
        status: "failed",
      });

      // Refund one chance

      await User.findByIdAndUpdate(job.data.userId, {
        $inc: {
          totalChances: 1,
        },
      });

      console.log(
        `Roadmap permanently failed. Chance refunded for user ${job.data.userId}`,
      );
    } catch (refundError) {
      console.error("Failed to update roadmap or refund user:", refundError);
    }
  }
});

// Worker-level error

roadmapWorker.on("error", (error) => {
  console.error("Roadmap worker error:", error);
});

console.log("Roadmap worker loaded");

export default roadmapWorker;
