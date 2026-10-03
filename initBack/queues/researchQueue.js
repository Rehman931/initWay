import { Queue } from "bullmq";
import redis from "../config/redis.js";

const researchQueue = new Queue("research", {
  connection: redis,

  defaultJobOptions: {
    attempts: 1,
    removeOnComplete: true,
    removeOnFail: true,
  },
});

export default researchQueue;
