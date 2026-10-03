import Roadmap from "../models/Roadmap.js";

const getRoadmap = async (req, res) => {
  const { roadmapId } = req.params;

  try {
    const findRoadmapDetails = await Roadmap.findById(roadmapId);

    if (!findRoadmapDetails) {
      return res.status(404).json({
        message: "Roadmap does not exist.",
      });
    }

    return res.status(200).json({
      roadmapId: roadmapId,
      roadmapReport: findRoadmapDetails.roadmapReport,
    });
  } catch (err) {
    console.error("Get roadmap error:", err);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export default getRoadmap;
