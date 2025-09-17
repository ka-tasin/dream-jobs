import { Application } from "../../../prisma/generated/prisma";

export interface IApplicationRepository {
  getByJobId(jobId: string): Promise<Application[]>;
  getByEmployerId(employerId: string): Promise<Application[]>;
  getApplicationsByUser(userId: string): Promise<Application[]>;
  create(
    userId: string,
    jobId: string,
    resumeUrl?: string,
    coverLetter?: string
  ): Promise<Application>;
  findDuplicate(userId: string, jobId: string): any;
}
