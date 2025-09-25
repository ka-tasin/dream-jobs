import { Application } from "../../../prisma/generated/prisma";

export interface IApplicatoinService {
  getApplicationsForEmployer(employerId: string): Promise<Application[]>;
  getApplicationsForJob(jobId: string): Promise<Application[]>;
}
