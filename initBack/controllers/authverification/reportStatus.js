import Validation from "../../models/Validation.js";
import Pitch from "../../models/Pitch.js";
import Roadmap from "../../models/Roadmap.js";
import TechStack from "../../models/TechStack.js";

const reportStatus = async (req, res) => {
  try {
    const { reportId, reportType } = req.body;
    const userId = req.userId;

    // -----------------------------
    // Validate input
    // -----------------------------

    if (!reportId) {
      return res.status(400).json({
        message: "Report ID is required.",
      });
    }

    if (!reportType) {
      return res.status(400).json({
        message: "Report type is required.",
      });
    }

    // -----------------------------
    // Select model
    // -----------------------------

    let ReportModel;
    let reportField;

    switch (reportType) {
      case "validation":
        ReportModel = Validation;
        reportField = "validationReport";
        break;

      case "pitch":
        ReportModel = Pitch;
        reportField = "pitchReport";
        break;

      case "roadmap":
        ReportModel = Roadmap;
        reportField = "roadmapReport";
        break;

      case "techstack":
        ReportModel = TechStack;
        reportField = "techStackReport";
        break;

      default:
        return res.status(400).json({
          message: "Invalid report type.",
        });
    }

    // -----------------------------
    // Find report
    // -----------------------------

    const report = await ReportModel.findById(reportId).populate({
      path: "projectId",
      select: "projectName userId",
    });

    if (!report) {
      return res.status(404).json({
        message: "Report not found.",
      });
    }

    // -----------------------------
    // Verify project ownership
    // -----------------------------

    if (!report.projectId || report.projectId.userId.toString() !== userId) {
      return res.status(403).json({
        message: "You are not authorized to access this report.",
      });
    }

    // -----------------------------
    // Return status
    // -----------------------------

    return res.status(200).json({
      reportId: report._id,
      projectId: report.projectId._id,
      projectName: report.projectId.projectName,
      reportType,
      status: report.status,
      report: report[reportField] || null,
    });
  } catch (err) {
    console.error("Report status error:", err);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export default reportStatus;
