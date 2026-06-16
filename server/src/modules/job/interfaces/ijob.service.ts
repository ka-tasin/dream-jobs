import { Job } from "../../../../prisma/generated/prisma/index.js";

export interface IJobService {
  createJob(data: Omit<Job, "id" | "postedAt">): Promise<Job>;
  getJobById(id: string): Promise<Job | null>;
  listJobs(): Promise<Job[]>;
  listJobsByCreator(userId: string): Promise<Job[]>;
  deleteJob(id: string): Promise<Job>;
}
