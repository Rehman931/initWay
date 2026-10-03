import Validation from "../models/Validation.js";

const getValidation = async (req, res) => {
  const { validationId } = req.params;

  try {
    const findValidationDetails = await Validation.findById(validationId);

    if (!findValidationDetails) {
      return res.status(404).json({
        message: "Validation does not exist.",
      });
    }

    return res.status(200).json({
      validationId: validationId,
      validationReport: findValidationDetails.validationReport,
    });
  } catch (err) {
    console.error("Get validation error:", err);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export default getValidation;
