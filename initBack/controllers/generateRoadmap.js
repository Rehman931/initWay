import Roadmap from "../models/Roadmap.js";
import Internet from "../models/Internet.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

import roadmapQueue from "../queues/roadmapQueue.js";

const generateRoadmap = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.userId;

  try {
    // 1. Find project

    const findProject = await Project.findById(projectId);

    if (!findProject) {
      return res.status(404).json({
        message: "Project does not exist.",
      });
    }

    // 2. Verify project belongs to logged-in user

    if (findProject.userId.toString() !== userId) {
      return res.status(403).json({
        message: "You are not authorized to access this project.",
      });
    }

    // 3. Find user

    const userFind = await User.findById(userId);

    if (!userFind) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // 4. Check chances

    if (userFind.totalChances <= 0) {
      return res.status(403).json({
        message: "Max limit reached. Please upgrade.",
      });
    }

    // 5. Check internet research

    const findInternet = await Internet.findOne({
      projectId,
    });

    if (!findInternet) {
      return res.status(404).json({
        message: "Internet data does not exist.",
      });
    }

    // 6. Consume one chance

    userFind.totalChances -= 1;
    await userFind.save();

    // 7. Create roadmap document

    const createRoadmap = await Roadmap.create({
      projectId,
      status: "generating",
      roadmapReport: null,
    });

    // 8. Add roadmap job to BullMQ

    try {
      await roadmapQueue.add("roadmap-project", {
        roadmapId: createRoadmap._id.toString(),
        projectId: projectId.toString(),
        userId: userId.toString(),
      });
    } catch (queueError) {
      console.error("Failed to add roadmap job:", queueError);

      // Mark roadmap as failed

      await Roadmap.findByIdAndUpdate(createRoadmap._id, {
        status: "failed",
      });

      // Refund chance

      await User.findByIdAndUpdate(userId, {
        $inc: {
          totalChances: 1,
        },
      });

      return res.status(500).json({
        message: "Failed to start roadmap generation.",
      });
    }

    // 9. Respond immediately

    return res.status(201).json({
      message: "Roadmap generation started.",
      reportId: createRoadmap._id,
      projectId,
      status: createRoadmap.status,
    });
  } catch (err) {
    console.error("Generate roadmap error:", err);

    if (!res.headersSent) {
      return res.status(500).json({
        message: "Internal server error.",
      });
    }
  }
};

export default generateRoadmap;
