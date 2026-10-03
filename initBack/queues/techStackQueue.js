import { Queue } from "bullmq";

const techStackQueue = new Queue("techstack", {
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

export default techStackQueue;
