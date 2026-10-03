import mongoose from "mongoose";

const internetInfoSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Project",
    },

    internetData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Internet = mongoose.model("Internet", internetInfoSchema);

export default Internet;
