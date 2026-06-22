import prisma from "../../../prisma/index.js";
import { Job } from "../../../prisma/generated/prisma/index.js";

export class JobService {
  async createJob(data: Omit<Job, "id" | "postedAt">): Promise<Job> {
    return prisma.job.create({
      data: {
        ...data,
        deadline: data.deadline ? new Date(data.deadline) : null,
      },
    });
  }

  async getJobById(id: string): Promise<Job | null> {
    return prisma.job.findUnique({ where: { id } });
  }

  async listJobs(): Promise<Job[]> {
    return prisma.job.findMany({
      orderBy: { postedAt: "desc" },
    });
  }

  async listJobsByCreator(userId: string): Promise<Job[]> {
    return prisma.job.findMany({ where: { createdBy: userId } });
  }

  async deleteJob(id: string): Promise<Job> {
    return prisma.job.delete({ where: { id } });
  }
}

export const jobService = new JobService();
