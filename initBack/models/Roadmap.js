import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema(
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

    roadmapReport: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Roadmap =
  mongoose.models.Roadmap || mongoose.model("Roadmap", roadmapSchema);

export default Roadmap;
