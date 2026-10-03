import Project from "../models/Project.js";

const totalprojects = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login again.",
      });
    }

    // ---------------------------------------
    // ONLY FETCH PROJECTS BELONGING
    // TO THE LOGGED-IN USER
    // ---------------------------------------
    const projectsData = await Project.find(
      { userId },
      {
        projectName: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    ).sort({ updatedAt: -1 });

    // ---------------------------------------
    // FORMAT RESPONSE
    // ---------------------------------------
    const projects = projectsData.map((project) => ({
      projectId: project._id,
      projectName: project.projectName,
      status: project.status,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Get projects error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects.",
    });
  }
};

export default totalprojects;
