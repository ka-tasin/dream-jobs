import { inject, injectable } from "inversify";
import { TYPES } from "../config/ioc.types";
import IUnitOfWork from "../repositories/interfaces/iunitofwork.repository";
import { IApplicatoinService } from "./interfaces/iapplication.service";
import { Application } from "../../prisma/generated/prisma";

@injectable()
export default class ApplicationService implements IApplicatoinService {
  constructor(@inject(TYPES.IUnitOfWork) private unitOfWork: IUnitOfWork) {}

  async getApplicationsForEmployer(employerId: string): Promise<Application[]> {
    return this.unitOfWork.Application.getByEmployerId(employerId);
  }

  async getApplicationsForJob(jobId: string): Promise<Application[]> {
    return this.unitOfWork.Application.getByJobId(jobId);
  }

  async getUserApplications(userId: string): Promise<Application[]> {
    return this.unitOfWork.Application.getApplicationsByUser(userId);
  }

  async applyForJob(
    userId: string,
    jobId: string,
    resumeUrl?: string,
    coverLetter?: string
  ): Promise<Application> {
    const existing = await this.unitOfWork.Application.findDuplicate(
      userId,
      jobId
    );
    if (existing) throw new Error("You already applied to this job");

    return this.unitOfWork.Application.create(
      userId,
      jobId,
      resumeUrl,
      coverLetter
    );
  }
}
