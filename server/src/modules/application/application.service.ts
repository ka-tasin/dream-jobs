import prisma from "../../../prisma/index.js";
import { Application } from "../../../prisma/generated/prisma/index.js";

export class ApplicationService {
  async getApplicationsForEmployer(employerId: string): Promise<Application[]> {
    return prisma.application.findMany({
      where: {
        job: {
          createdBy: employerId,
        },
      },
      include: {
        user: true,
        job: true,
      },
      orderBy: { appliedAt: "desc" },
    });
  }

  async getApplicationsForJob(jobId: string): Promise<Application[]> {
    return prisma.application.findMany({
      where: { jobId },
      include: { user: true },
      orderBy: { appliedAt: "desc" },
    });
  }

  async applyToJob(
    userId: string,
    jobId: string,
    resumeUrl?: string,
    coverLetter?: string
  ): Promise<Application> {
    const existing = await prisma.application.findFirst({
      where: { userId, jobId },
    });

    if (existing) {
      throw new Error("You have already applied to this job.");
    }

    return prisma.application.create({
      data: {
        userId,
        jobId,
        resumeUrl,
        coverLetter,
      },
    });
  }

  async getUserApplications(userId: string): Promise<Application[]> {
    return prisma.application.findMany({
      where: { userId },
      orderBy: { appliedAt: "desc" },
    });
  }

  async getJobApplications(jobId: string): Promise<Application[]> {
    return prisma.application.findMany({
      where: { jobId },
      orderBy: { appliedAt: "desc" },
    });
  }
}

export const applicationService = new ApplicationService();
