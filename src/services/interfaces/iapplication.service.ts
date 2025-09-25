import { Application } from "../../../prisma";

export interface IApplicatoinService {
  getApplicationsForEmployer(employerId: string): Promise<Application[]>;
  getApplicationsForJob(jobId: string): Promise<Application[]>;
}
