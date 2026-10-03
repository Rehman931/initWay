import { Queue } from "bullmq";

const validationQueue = new Queue("validation", {
  connection: {
    url: process.env.REDIS_URL,
  },

  defaultJobOptions: {
    attempts: 1,
    removeOnComplete: true,
    removeOnFail: true,
  },
});

export default validationQueue;
