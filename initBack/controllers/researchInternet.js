import Project from "../models/Project.js";
import User from "../models/User.js";

import researchQueue from "./queues/researchQueue.js";

const researchInternet = async (req, res) => {
  try {
    const {
      projectName,
      problem,
      targetCustomer,
      currentSolution,
      proposedSolution,
      evidence,
    } = req.body;

    const userId = req.userId;

    // 1. Validate user and project information
    if (
      !userId ||
      !projectName ||
      !problem ||
      !targetCustomer ||
      !proposedSolution
    ) {
      return res.status(400).json({
        message: "Required project information is missing.",
      });
    }

    // 2. Find user
    const userFind = await User.findById(userId);

    if (!userFind) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // 3. Check project limits
    if (userFind.totalChances <= 0 || userFind.totalReport <= 0) {
      return res.status(403).json({
        message: "Project generation limit reached. Please upgrade.",
      });
    }

    // 4. Create project
    const createProject = await Project.create({
      userId,
      projectName,
      status: "initializing",
      problem,
      targetCustomer,
      currentSolution,
      proposedSolution,
      evidence,
    });

    // 5. Consume one chance
    userFind.totalChances -= 1;
    await userFind.save();

    // 6. Add research job to BullMQ
    try {
      await researchQueue.add(
        "research-project",
        {
          projectId: createProject._id.toString(),
          userId: userId.toString(),

          projectName,
          problem,
          targetCustomer,
          currentSolution,
          proposedSolution,
          evidence,
        },
        {
          jobId: `research-${createProject._id}`,
        },
      );
    } catch (queueError) {
      console.error("Failed to add research job:", queueError);

      // Mark project as failed
      createProject.status = "failed";
      await createProject.save();

      // Refund the user's chance
      userFind.totalChances += 1;
      await userFind.save();

      return res.status(500).json({
        message: "Unable to start project research.",
      });
    }

    // 7. Respond immediately
    return res.status(201).json({
      message: "Project initialization started!",
      projectName: createProject.projectName,
      projectId: createProject._id,
      status: createProject.status,
    });
  } catch (err) {
    console.error("Research error:", err);

    if (!res.headersSent) {
      return res.status(500).json({
        message: "Internal server error.",
      });
    }
  }
};

export default researchInternet;
