import { Queue } from "bullmq";
import redis from "../../config/redis.js";

const researchQueue = new Queue("research", {
  connection: redis,

  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 5000,
    },

    removeOnComplete: true,

    removeOnFail: false,
  },
});

export default researchQueue;
