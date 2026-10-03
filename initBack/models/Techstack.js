import mongoose from "mongoose";

const techStackSchema = new mongoose.Schema(
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

    techStackReport: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const TechStack =
  mongoose.models.TechStack || mongoose.model("TechStack", techStackSchema);

export default TechStack;
