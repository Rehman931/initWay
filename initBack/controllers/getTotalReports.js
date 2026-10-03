import Project from "../models/Project.js";
import Pitch from "../models/Pitch.js";
import Roadmap from "../models/Roadmap.js";
import TechStack from "../models/Techstack.js";
import Validation from "../models/Validation.js";

const totalReports = async (req, res) => {
  try {
    // User ID comes from JWT middleware
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. User ID not found.",
      });
    }

    // Get user's projects
    const projects = await Project.find({
      userId: userId,
    }).select("_id projectName");

    const projectMap = new Map(
      projects.map((project) => [project._id.toString(), project.projectName]),
    );

    const projectIds = projects.map((project) => project._id);

    // Get reports belonging to user's projects
    const [validations, pitches, roadmaps, techstacks] = await Promise.all([
      Validation.find({
        projectId: { $in: projectIds },
      }).select("_id projectId createdAt status"),

      Pitch.find({
        projectId: { $in: projectIds },
      }).select("_id projectId createdAt status"),

      Roadmap.find({
        projectId: { $in: projectIds },
      }).select("_id projectId createdAt status"),

      TechStack.find({
        projectId: { $in: projectIds },
      }).select("_id projectId createdAt status"),
    ]);

    const reports = [
      ...validations.map((report) => ({
        reportId: report._id,
        projectId: report.projectId,
        projectName:
          projectMap.get(report.projectId.toString()) || "Untitled Project",
        type: "validation",
        status: report.status,
        createdAt: report.createdAt,
      })),

      ...pitches.map((report) => ({
        reportId: report._id,
        projectId: report.projectId,
        projectName:
          projectMap.get(report.projectId.toString()) || "Untitled Project",
        type: "pitch",
        status: report.status,
        createdAt: report.createdAt,
      })),

      ...roadmaps.map((report) => ({
        reportId: report._id,
        projectId: report.projectId,
        projectName:
          projectMap.get(report.projectId.toString()) || "Untitled Project",
        type: "roadmap",
        status: report.status,
        createdAt: report.createdAt,
      })),

      ...techstacks.map((report) => ({
        reportId: report._id,
        projectId: report.projectId,
        projectName:
          projectMap.get(report.projectId.toString()) || "Untitled Project",
        type: "techstack",
        status: report.status,
        createdAt: report.createdAt,
      })),
    ];

    // Newest reports first
    reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      totalReports: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Total reports error:", error);

    return res.status(500).json({
      message: "Unable to fetch report history.",
      error: error.message,
    });
  }
};

export default totalReports;
