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
}
