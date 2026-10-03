import "dotenv/config";

import axios from "axios";
import { Worker } from "bullmq";

import Validation from "../../models/Validation.js";
import Project from "../../models/Project.js";
import Internet from "../../models/Internet.js";
import User from "../../models/User.js";

const validationWorker = new Worker(
  "validation",

  async (job) => {
    console.log("Validation job received:", job.id);

    const { validationId, projectId, userId } = job.data;

    // 1. Validate job data

    if (!validationId || !projectId || !userId) {
      throw new Error("Validation ID, Project ID, or User ID is missing.");
    }

    // 2. Find validation document

    const validation = await Validation.findById(validationId);

    if (!validation) {
      throw new Error(`Validation ${validationId} does not exist.`);
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

          feature: "validation",

          featureInput: {},

          internetdata: internet.internetData,
        },
        {
          timeout: 120000,
        },
      );
    } catch (flaskError) {
      console.error(
        "Flask validation request failed:",
        flaskError.response?.data || flaskError.message,
      );

      throw new Error("AI validation service failed.");
    }

    // 7. Get AI response

    const aiData = response.data;

    // 8. Validate AI response

    if (!aiData?.output) {
      throw new Error("AI returned no validation output.");
    }

    // 9. Save generated validation

    await Validation.findByIdAndUpdate(
      validationId,
      {
        status: "completed",
        validationReport: aiData.output,
      },
      {
        new: true,
      },
    );

    console.log("Validation generation completed:", validationId);

    // 10. Return result to BullMQ

    return {
      success: true,
      validationId,
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

validationWorker.on("completed", (job) => {
  console.log(`Validation job ${job.id} completed`);
});

// Job failed

validationWorker.on("failed", async (job, error) => {
  if (!job) {
    console.error("Validation job failed:", error.message);

    return;
  }

  console.error(`Validation job ${job.id} failed:`, error.message);

  // BullMQ retries automatically.
  // Refund only after the final attempt.

  const attemptsMade = job.attemptsMade;

  const maxAttempts = job.opts.attempts || 1;

  if (attemptsMade >= maxAttempts) {
    try {
      // Mark validation as failed

      await Validation.findByIdAndUpdate(job.data.validationId, {
        status: "failed",
      });

      // Refund one chance

      await User.findByIdAndUpdate(job.data.userId, {
        $inc: {
          totalChances: 1,
        },
      });

      console.log(
        `Validation permanently failed. Chance refunded for user ${job.data.userId}`,
      );
    } catch (refundError) {
      console.error("Failed to update validation or refund user:", refundError);
    }
  }
});

// Worker-level error

validationWorker.on("error", (error) => {
  console.error("Validation worker error:", error);
});

console.log("Validation worker loaded");

export default validationWorker;
