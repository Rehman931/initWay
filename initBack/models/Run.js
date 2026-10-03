const runSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["validation", "pitch", "roadmap", "techstack"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "running", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true },
);
