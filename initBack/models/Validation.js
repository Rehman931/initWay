import mongoose from "mongoose";

const validationSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["generating", "completed", "failed"],
      default: "generating",
    },

    validationReport: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Validation =
  mongoose.models.Validation || mongoose.model("Validation", validationSchema);

export default Validation;
