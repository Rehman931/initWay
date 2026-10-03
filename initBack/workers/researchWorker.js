import "dotenv/config";
import axios from "axios";
import { Worker } from "bullmq";

import Project from "../../models/Project.js";
import Internet from "../../models/Internet.js";
import User from "../../models/User.js";

const researchWorker = new Worker(
  "research",

  async (job) => {
    console.log("Research job received:", job.id);

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

    // 1. Validate job data
    if (!projectId || !userId) {
      throw new Error("Project ID or User ID is missing.");
    }

    if (!projectName || !problem || !targetCustomer || !proposedSolution) {
      throw new Error("Required project data is missing.");
    }

    // 2. Check that project exists
    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error(`Project ${projectId} does not exist.`);
    }

    // 3. Call Flask AI service
    let response;

    try {
      response = await axios.post(
        `${process.env.FLASK_URL}/research`,
        {
          constantquest: {
            projectName,
            problem,
            targetCustomer,
            currentSolution,
            proposedSolution,
            evidence,
          },
        },
        {
          timeout: 120000,
        },
      );
    } catch (flaskError) {
      console.error(
        "Flask research request failed:",
        flaskError.response?.data || flaskError.message,
      );

      throw new Error("AI research service failed.");
    }

    // 4. Get AI response
    const aiData = response.data;

    // 5. Validate AI response
    if (!aiData?.internetdata) {
      throw new Error("AI returned invalid research data.");
    }

    // 6. Save research data
    //
    // upsert prevents duplicate Internet documents
    // when BullMQ retries the same job.
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

    // 7. Mark project as initialized
    await Project.findByIdAndUpdate(projectId, {
      status: "initialized",
    });

    console.log("Project initialized:", projectId);

    // 8. Return result to BullMQ
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

    concurrency: 2,
  },
);

// Job completed
researchWorker.on("completed", (job) => {
  console.log(`Research job ${job.id} completed`);
});

// Job failed
researchWorker.on("failed", async (job, error) => {
  if (!job) {
    console.error("Research job failed:", error.message);
    return;
  }

  console.error(`Research job ${job.id} failed:`, error.message);

  // BullMQ retries the job automatically.
  // Refund the chance only after the final attempt.

  const attemptsMade = job.attemptsMade;
  const maxAttempts = job.opts.attempts || 1;

  if (attemptsMade >= maxAttempts) {
    try {
      // Mark project as failed
      await Project.findByIdAndUpdate(job.data.projectId, {
        status: "failed",
      });

      // Refund one chance
      await User.findByIdAndUpdate(job.data.userId, {
        $inc: {
          totalChances: 1,
        },
      });

      console.log(
        `Research permanently failed. Chance refunded for user ${job.data.userId}`,
      );
    } catch (refundError) {
      console.error("Failed to update project/refund user:", refundError);
    }
  }
});

// Worker-level error
researchWorker.on("error", (error) => {
  console.error("Research worker error:", error);
});

console.log("Research worker loaded");

export default researchWorker;
