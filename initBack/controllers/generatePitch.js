import Pitch from "../models/Pitch.js";
import Internet from "../models/Internet.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

import pitchQueue from "../queues/pitchQueue.js";

const generatePitch = async (req, res) => {
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

    // 7. Create pitch document

    const createPitch = await Pitch.create({
      projectId,
      status: "generating",
      pitchReport: null,
    });

    // 8. Add job to BullMQ

    try {
      await pitchQueue.add("pitch-project", {
        pitchId: createPitch._id.toString(),
        projectId: projectId.toString(),
        userId: userId.toString(),
      });
    } catch (queueError) {
      console.error("Failed to add pitch job:", queueError);

      // Mark pitch as failed

      await Pitch.findByIdAndUpdate(createPitch._id, {
        status: "failed",
      });

      // Refund chance

      await User.findByIdAndUpdate(userId, {
        $inc: {
          totalChances: 1,
        },
      });

      return res.status(500).json({
        message: "Failed to start pitch generation.",
      });
    }

    // 9. Respond immediately

    return res.status(201).json({
      message: "Pitch generation started.",
      reportId: createPitch._id,
      projectId,
      status: createPitch.status,
    });
  } catch (err) {
    console.error("Generate pitch error:", err);

    if (!res.headersSent) {
      return res.status(500).json({
        message: "Internal server error.",
      });
    }
  }
};

export default generatePitch;
