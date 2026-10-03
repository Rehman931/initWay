import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    projectName: {
      type: String,
      required: true,
    },

    problem: String,

    targetCustomer: String,

    currentSolution: String,

    proposedSolution: String,

    evidence: String,

    status: {
      type: String,
      enum: ["initializing", "initialized", "failed"],
      default: "initializing",
    },
  },
  { timestamps: true },
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
