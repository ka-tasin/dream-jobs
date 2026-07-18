import {Queue} from "bullmq"
import { redisConnectionOption } from  "../config/redis.config.js";

export const emailQueue = new Queue("email-queue", {
    connection: redisConnectionOption
})

// Helper function to push jobs into the queue
export const addEmailJob = async (jobName: string, data: { to: string; subject: string; body: string }) => {
  await emailQueue.add(jobName, data, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000, 
    },
  });
};