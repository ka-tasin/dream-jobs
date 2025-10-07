import { inject, injectable } from "inversify";
import { TYPES } from "../config/ioc.types";
import IUnitOfWork from "../repositories/interfaces/iunitofwork.repository";
import { IApplicatoinService } from "./interfaces/iapplication.service";
import { Application } from "@prisma/client";

@injectable()
export default class ApplicationService implements IApplicatoinService {
  constructor(@inject(TYPES.IUnitOfWork) private unitOfWork: IUnitOfWork) {}

  async getApplicationsForEmployer(employerId: string) {
    return this.unitOfWork.Application.getByEmployerId(employerId);
  }

  async getApplicationsForJob(jobId: string) {
    return this.unitOfWork.Application.getByJobId(jobId);
  }

  async applyToJob(
    userId: string,
    jobId: string,
    resumeUrl?: string,
    coverLetter?: string
  ): Promise<Application> {
    const existing = await this.unitOfWork.Application.findByUserAndJob(
      userId,
      jobId
    );
    if (existing) {
      throw new Error("You have already applied to this job.");
    }

    return this.unitOfWork.Application.create({
      userId,
      jobId,
      resumeUrl,
      coverLetter,
    });
  }

  async getUserApplications(userId: string): Promise<Application[]> {
    return this.unitOfWork.Application.findByUser(userId);
  }

  async getJobApplications(jobId: string): Promise<Application[]> {
    return this.unitOfWork.Application.findByJob(jobId);
  }
}
