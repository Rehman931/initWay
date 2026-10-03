import "dotenv/config";
import axios from "axios";
import { Worker } from "bullmq";

import Pitch from "../../models/Pitch.js";
import Project from "../../models/Project.js";
import Internet from "../../models/Internet.js";
import User from "../../models/User.js";

const pitchWorker = new Worker(
  "pitch",

  async (job) => {
    console.log("Pitch job received:", job.id);

    const { pitchId, projectId, userId } = job.data;

    // 1. Validate job data

    if (!pitchId || !projectId || !userId) {
      throw new Error("Pitch ID, Project ID, or User ID is missing.");
    }

    // 2. Find pitch

    const pitch = await Pitch.findById(pitchId);

    if (!pitch) {
      throw new Error(`Pitch ${pitchId} does not exist.`);
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

          feature: "pitch",

          featureInput: {},

          internetdata: internet.internetData,
        },
        {
          timeout: 120000,
        },
      );
    } catch (flaskError) {
      console.error(
        "Flask pitch request failed:",
        flaskError.response?.data || flaskError.message,
      );

      throw new Error("AI pitch service failed.");
    }

    // 7. Get AI response

    const aiData = response.data;

    // 8. Validate AI response

    if (!aiData?.output) {
      throw new Error("AI returned no pitch output.");
    }

    // 9. Save generated pitch

    await Pitch.findByIdAndUpdate(
      pitchId,
      {
        status: "completed",
        pitchReport: aiData.output,
      },
      {
        new: true,
      },
    );

    console.log("Pitch generation completed:", pitchId);

    // 10. Return result to BullMQ

    return {
      success: true,
      pitchId,
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

pitchWorker.on("completed", (job) => {
  console.log(`Pitch job ${job.id} completed`);
});

// Job failed

pitchWorker.on("failed", async (job, error) => {
  if (!job) {
    console.error("Pitch job failed:", error.message);

    return;
  }

  console.error(`Pitch job ${job.id} failed:`, error.message);

  // BullMQ retries automatically.
  // Refund only after the final attempt.

  const attemptsMade = job.attemptsMade;

  const maxAttempts = job.opts.attempts || 1;

  if (attemptsMade >= maxAttempts) {
    try {
      // Mark pitch as failed

      await Pitch.findByIdAndUpdate(job.data.pitchId, {
        status: "failed",
      });

      // Refund one chance

      await User.findByIdAndUpdate(job.data.userId, {
        $inc: {
          totalChances: 1,
        },
      });

      console.log(
        `Pitch permanently failed. Chance refunded for user ${job.data.userId}`,
      );
    } catch (refundError) {
      console.error("Failed to update pitch or refund user:", refundError);
    }
  }
});

// Worker-level error

pitchWorker.on("error", (error) => {
  console.error("Pitch worker error:", error);
});

console.log("Pitch worker loaded");

export default pitchWorker;
