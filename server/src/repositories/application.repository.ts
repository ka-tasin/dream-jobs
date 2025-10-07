import { injectable } from "inversify";
import prisma from "../../prisma";
import { IApplicationRepository } from "./interfaces/iapplication.repository";
import { Application, Prisma } from "@prisma/client";

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

  async create(
    data: Prisma.ApplicationUncheckedCreateInput
  ): Promise<Application> {
    return prisma.application.create({ data });
  }

  async findByUserAndJob(
    userId: string,
    jobId: string
  ): Promise<Application | null> {
    return prisma.application.findFirst({ where: { userId, jobId } });
  }

  async findByJob(jobId: string): Promise<Application[]> {
    return prisma.application.findMany({
      where: { jobId },
      orderBy: { appliedAt: "desc" },
    });
  }

  async findByUser(userId: string): Promise<Application[]> {
    return prisma.application.findMany({
      where: { userId },
      orderBy: { appliedAt: "desc" },
    });
  }
}
