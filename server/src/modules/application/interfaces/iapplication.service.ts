import { Application } from "../../../../prisma/generated/prisma/index.js";

export interface IApplicatoinService {
  getApplicationsForEmployer(employerId: string): Promise<Application[]>;
  getApplicationsForJob(jobId: string): Promise<Application[]>;
  applyToJob(
    userId: string,
    jobId: string,
    resumeUrl?: string,
    coverLetter?: string
  ): Promise<Application>;
  getUserApplications(userId: string): Promise<Application[]>;
  getJobApplications(jobId: string): Promise<Application[]>;
}
