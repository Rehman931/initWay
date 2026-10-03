import "dotenv/config";

import axios from "axios";
import { Worker } from "bullmq";

import TechStack from "../../models/TechStack.js";
import Project from "../../models/Project.js";
import Internet from "../../models/Internet.js";
import User from "../../models/User.js";

const techStackWorker = new Worker(
  "techstack",

  async (job) => {
    console.log("Tech stack job received:", job.id);

    const { techStackId, projectId, userId } = job.data;

    // 1. Validate job data

    if (!techStackId || !projectId || !userId) {
      throw new Error("Tech Stack ID, Project ID, or User ID is missing.");
    }

    // 2. Find Tech Stack document

    const techStack = await TechStack.findById(techStackId);

    if (!techStack) {
      throw new Error(`Tech Stack ${techStackId} does not exist.`);
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

          feature: "techstack",

          featureInput: {},

          internetdata: internet.internetData,
        },
        {
          timeout: 120000,
        },
      );
    } catch (flaskError) {
      console.error(
        "Flask tech stack request failed:",
        flaskError.response?.data || flaskError.message,
      );

      throw new Error("AI tech stack service failed.");
    }

    // 7. Get AI response

    const aiData = response.data;

    // 8. Validate AI response

    if (!aiData?.output) {
      throw new Error("AI returned no tech stack output.");
    }

    // 9. Save generated Tech Stack

    await TechStack.findByIdAndUpdate(
      techStackId,
      {
        status: "completed",
        techStackReport: aiData.output,
      },
      {
        new: true,
      },
    );

    console.log("Tech stack generation completed:", techStackId);

    // 10. Return result to BullMQ

    return {
      success: true,
      techStackId,
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

techStackWorker.on("completed", (job) => {
  console.log(`Tech stack job ${job.id} completed`);
});

// Job failed

techStackWorker.on("failed", async (job, error) => {
  if (!job) {
    console.error("Tech stack job failed:", error.message);

    return;
  }

  console.error(`Tech stack job ${job.id} failed:`, error.message);

  // BullMQ retries automatically.
  // Refund only after the final attempt.

  const attemptsMade = job.attemptsMade;

  const maxAttempts = job.opts.attempts || 1;

  if (attemptsMade >= maxAttempts) {
    try {
      // Mark report as failed

      await TechStack.findByIdAndUpdate(job.data.techStackId, {
        status: "failed",
      });

      // Refund one chance

      await User.findByIdAndUpdate(job.data.userId, {
        $inc: {
          totalChances: 1,
        },
      });

      console.log(
        `Tech stack permanently failed. Chance refunded for user ${job.data.userId}`,
      );
    } catch (refundError) {
      console.error("Failed to update Tech Stack or refund user:", refundError);
    }
  }
});

// Worker-level error

techStackWorker.on("error", (error) => {
  console.error("Tech stack worker error:", error);
});

console.log("Tech stack worker loaded");

export default techStackWorker;
import "dotenv/config";

import axios from "axios";
import { Worker } from "bullmq";

import TechStack from "../../models/TechStack.js";
import Project from "../../models/Project.js";
import Internet from "../../models/Internet.js";
import User from "../../models/User.js";

const techStackWorker = new Worker(
  "techstack",

  async (job) => {
    console.log("Tech stack job received:", job.id);

    const {
      techStackId,
      projectId,
      userId,
    } = job.data;

    // 1. Validate job data

    if (!techStackId || !projectId || !userId) {
      throw new Error(
        "Tech Stack ID, Project ID, or User ID is missing."
      );
    }

    // 2. Find Tech Stack document

    const techStack = await TechStack.findById(
      techStackId
    );

    if (!techStack) {
      throw new Error(
        `Tech Stack ${techStackId} does not exist.`
      );
    }

    // 3. Find project

    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error(
        `Project ${projectId} does not exist.`
      );
    }

    // 4. Verify project belongs to user

    if (project.userId.toString() !== userId) {
      throw new Error(
        "Project does not belong to this user."
      );
    }

    // 5. Find internet research

    const internet = await Internet.findOne({
      projectId,
    });

    if (!internet) {
      throw new Error(
        `Internet research does not exist for project ${projectId}.`
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

          feature: "techstack",

          featureInput: {},

          internetdata: internet.internetData,
        },
        {
          timeout: 120000,
        }
      );
    } catch (flaskError) {
      console.error(
        "Flask tech stack request failed:",
        flaskError.response?.data ||
          flaskError.message
      );

      throw new Error(
        "AI tech stack service failed."
      );
    }

    // 7. Get AI response

    const aiData = response.data;

    // 8. Validate AI response

    if (!aiData?.output) {
      throw new Error(
        "AI returned no tech stack output."
      );
    }

    // 9. Save generated Tech Stack

    await TechStack.findByIdAndUpdate(
      techStackId,
      {
        status: "completed",
        techStackReport: aiData.output,
      },
      {
        new: true,
      }
    );

    console.log(
      "Tech stack generation completed:",
      techStackId
    );

    // 10. Return result to BullMQ

    return {
      success: true,
      techStackId,
      projectId,
      data: aiData,
    };
  },

  {
    connection: {
      url: process.env.REDIS_URL,
    },

    concurrency: 2,
  }
);

// Job completed

techStackWorker.on("completed", (job) => {
  console.log(
    `Tech stack job ${job.id} completed`
  );
});

// Job failed

techStackWorker.on(
  "failed",
  async (job, error) => {
    if (!job) {
      console.error(
        "Tech stack job failed:",
        error.message
      );

      return;
    }

    console.error(
      `Tech stack job ${job.id} failed:`,
      error.message
    );

    // BullMQ retries automatically.
    // Refund only after the final attempt.

    const attemptsMade =
      job.attemptsMade;

    const maxAttempts =
      job.opts.attempts || 1;

    if (attemptsMade >= maxAttempts) {
      try {
        // Mark report as failed

        await TechStack.findByIdAndUpdate(
          job.data.techStackId,
          {
            status: "failed",
          }
        );

        // Refund one chance

        await User.findByIdAndUpdate(
          job.data.userId,
          {
            $inc: {
              totalChances: 1,
            },
          }
        );

        console.log(
          `Tech stack permanently failed. Chance refunded for user ${job.data.userId}`
        );
      } catch (refundError) {
        console.error(
          "Failed to update Tech Stack or refund user:",
          refundError
        );
      }
    }
  }
);

// Worker-level error

techStackWorker.on("error", (error) => {
  console.error(
    "Tech stack worker error:",
    error
  );
});

console.log("Tech stack worker loaded");

export default techStackWorker;