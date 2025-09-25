import { Application } from "../../../prisma/generated/prisma";

export interface IApplicationRepository {
  getByJobId(jobId: string): Promise<Application[]>;
  getByEmployerId(employerId: string): Promise<Application[]>;
}
