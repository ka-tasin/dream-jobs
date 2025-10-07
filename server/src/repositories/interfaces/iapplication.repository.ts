import { Prisma } from "@prisma/client";
import { Application } from "../../../prisma/generated/prisma";

export interface IApplicationRepository {
  getByJobId(jobId: string): Promise<Application[]>;
  getByEmployerId(employerId: string): Promise<Application[]>;
  create(data: Prisma.ApplicationUncheckedCreateInput): Promise<Application>;
  findByUserAndJob(userId: string, jobId: string): Promise<Application | null>;
  findByJob(jobId: string): Promise<Application[]>;
  findByUser(userId: string): Promise<Application[]>;
}
