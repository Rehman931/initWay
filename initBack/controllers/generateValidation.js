import Project from "../models/Project.js";
import Validation from "../models/Validation.js";
import Internet from "../models/Internet.js";
import User from "../models/User.js";

import validationQueue from "../queues/validationQueue.js";

const generateValidation = async (req, res) => {
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

    // 5. Find internet research

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

    // 7. Create validation document

    const createValidation = await Validation.create({
      projectId,
      status: "generating",
      validationReport: null,
    });

    // 8. Add job to BullMQ

    try {
      await validationQueue.add("validation-project", {
        validationId: createValidation._id.toString(),
        projectId: projectId.toString(),
        userId: userId.toString(),
      });
    } catch (queueError) {
      console.error("Failed to add validation job:", queueError);

      // Mark validation as failed

      await Validation.findByIdAndUpdate(createValidation._id, {
        status: "failed",
      });

      // Refund chance

      await User.findByIdAndUpdate(userId, {
        $inc: {
          totalChances: 1,
        },
      });

      return res.status(500).json({
        message: "Failed to start validation generation.",
      });
    }

    // 9. Respond immediately

    return res.status(201).json({
      message: "Validation generation started.",
      reportId: createValidation._id,
      projectId,
      status: createValidation.status,
    });
  } catch (err) {
    console.error("Generate validation error:", err);

    if (!res.headersSent) {
      return res.status(500).json({
        message: "Internal server error.",
      });
    }
  }
};

export default generateValidation;
