import Project from "../../models/Project.js";

const projectStatus = async (req, res) => {
  try {
    const { projectId } = req.body;
    const userId = req.userId;

    if (!projectId) {
      return res.status(400).json({
        message: "Project ID is required.",
      });
    }

    const findProject = await Project.findById(projectId).select(
      "status projectName userId",
    );

    if (!findProject) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    // Make sure this project belongs to logged-in user
    if (findProject.userId.toString() !== req.userId) {
      return res.status(403).json({
        message: "You are not authorized to access this project.",
      });
    }

    return res.status(200).json({
      projectId: findProject._id,
      projectName: findProject.projectName,
      status: findProject.status,
    });
  } catch (err) {
    console.error("Check project status error:", err);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export default projectStatus;
