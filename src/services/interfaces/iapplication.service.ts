import { Application } from "../../../prisma/generated/prisma";

export interface IApplicatoinService {
  getApplicationsForEmployer(employerId: string): Promise<Application[]>;
  getApplicationsForJob(jobId: string): Promise<Application[]>;
  getUserApplications(userId: string): Promise<Application[]>;
  applyForJob(
    userId: string,
    jobId: string,
    resumeUrl?: string,
    coverLetter?: string
  ): Promise<Application>;
}
