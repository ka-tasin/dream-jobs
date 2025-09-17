import { injectable } from "inversify";
import prisma from "../../prisma";
import { Application } from "../../prisma/generated/prisma";
import { IApplicationRepository } from "./interfaces/iapplication.repository";

@injectable()
export default class ApplicationRepository implements IApplicationRepository {
  async getByEmployerId(employerId: string): Promise<Application[]> {
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

  async getByJobId(jobId: string): Promise<Application[]> {
    return prisma.application.findMany({
      where: { jobId },
      include: { user: true },
      orderBy: { appliedAt: "desc" },
    });
  }

  async getApplicationsByUser(userId: string): Promise<Application[]> {
    return prisma.application.findMany({
      where: { userId },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            description: true,
            postedAt: true,
          },
        },
      },
      orderBy: { appliedAt: "desc" },
    });
  }

  async create(
    userId: string,
    jobId: string,
    resumeUrl?: string,
    coverLetter?: string
  ): Promise<Application> {
    return prisma.application.create({
      data: {
        userId,
        jobId,
        resumeUrl,
        coverLetter,
      },
    });
  }

  async findDuplicate(userId: string, jobId: string) {
    return prisma.application.findFirst({
      where: { userId, jobId },
    });
  }
}
