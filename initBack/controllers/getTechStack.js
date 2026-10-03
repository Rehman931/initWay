import TechStack from "../models/TechStack.js";

const getTechStack = async (req, res) => {
  const { techstackId } = req.params;

  try {
    const findTechStackDetails = await TechStack.findById(techstackId);

    if (!findTechStackDetails) {
      return res.status(404).json({
        message: "Tech stack does not exist.",
      });
    }

    return res.status(200).json({
      techstackId: techstackId,
      techStackReport: findTechStackDetails.techStackReport,
    });
  } catch (err) {
    console.error("Get tech stack error:", err);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export default getTechStack;
