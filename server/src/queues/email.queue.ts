import { Queue } from "bullmq";
import { redisConnectionOptions } from "../config/redis.config.js";


export const emailQueue = new Queue("email-queue", {
  connection: redisConnectionOptions,
});

export interface EmailJobPayload {
  to: string;
  subject: string;
  body: string;
}


export const addEmailJob = async (jobName: string, data: EmailJobPayload) => {
  await emailQueue.add(jobName, data, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000, 
    },
  });
};