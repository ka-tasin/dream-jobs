import { Worker, Job } from "bullmq";
import { redisConnectionOptions } from "../config/redis.config.js";
import { transporter } from "../config/mail.config.js";
import { EmailJobPayload } from "../queues/email.queue.js";

// Initialize BullMQ Worker listening on 'email-queue'
export const emailWorker = new Worker<EmailJobPayload>(
  "email-queue",
  async (job: Job<EmailJobPayload>) => {
    const { to, subject, body } = job.data;
    console.log(`[Worker] Started processing Job #${job.id} for recipient: ${to}`);

    // 🟢 Send actual email via SMTP Server
    await transporter.sendMail({
      from: `"Dream Jobs Platform" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: body,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; rounded: 8px;">
          <h2 style="color: #2563eb;">Dream Jobs Notification</h2>
          <p>${body}</p>
        </div>
      `,
    });

    console.log(`[Worker] Real SMTP Email sent to ${to}`);
  },
  {
    connection: redisConnectionOptions,
    concurrency: 2, // Process up to 2 emails concurrently
  }
);

emailWorker.on("completed", (job) => console.log(`[Queue Event] Job #${job.id} completed.`));
emailWorker.on("failed", (job, err) => console.error(`[Queue Event] Job #${job?.id} failed:`, err.message));