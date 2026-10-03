import { Queue } from "bullmq";

const roadmapQueue = new Queue("roadmap", {
  connection: {
    url: process.env.REDIS_URL,
  },

  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 5000,
    },

    removeOnComplete: true,
    removeOnFail: true,
  },
});

export default roadmapQueue;
