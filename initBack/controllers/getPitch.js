import Pitch from "../models/Pitch.js";
import generatePitch from "./generatePitch.js";

const getPitch = async (req, res) => {
  const { pitchId } = req.params;

  try {
    const findPitchDetails = await Pitch.findById(pitchId);

    if (!findPitchDetails) {
      return res.status(404).json({
        message: "Pitch does not exist.",
      });
    }

    return res.status(200).json({
      pitchId: pitchId,
      pitchReport: findPitchDetails.pitchReport,
    });
  } catch (err) {
    console.error("Get pitch error:", err);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export default getPitch;
