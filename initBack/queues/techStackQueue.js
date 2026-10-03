import { Queue } from "bullmq";

const techStackQueue = new Queue("techstack", {
  connection: {
    url: process.env.REDIS_URL,
  },

  defaultJobOptions: {
    attempts: 1,
    removeOnComplete: true,
    removeOnFail: true,
  },
});

export default techStackQueue;
