import { Job } from "../../../prisma/generated/prisma";

export interface IJobRepository {
  create(data: Omit<Job, "id" | "postedAt">): Promise<Job>;
  findById(id: string): Promise<Job | null>;
  findAll(): Promise<Job[]>;
  findByCreator(userId: string): Promise<Job[]>;
  delete(id: string): Promise<Job>;
}
