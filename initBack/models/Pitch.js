import mongoose from "mongoose";

const pitchSchema = new mongoose.Schema(
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

    pitchReport: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Pitch = mongoose.model("Pitch", pitchSchema);

export default Pitch;
