import { injectable } from "inversify";
import prisma from "../../../prisma/index.js";
import { Job } from "../../../prisma/generated/prisma/index.js";
import { IJobRepository } from "./interfaces/ijob.repository.js";

@injectable()
export default class JobRepository implements IJobRepository {
  async create(data: Omit<Job, "id" | "postedAt">): Promise<Job> {
    return prisma.job.create({
      data: {
        ...data,
        deadline: data.deadline ? new Date(data.deadline) : null,
      },
    });
  }

  async findById(id: string): Promise<Job | null> {
    return prisma.job.findUnique({ where: { id } });
  }

  async findAll(): Promise<Job[]> {
    return prisma.job.findMany({
      orderBy: { postedAt: "desc" },
    });
  }

  async findByCreator(userId: string): Promise<Job[]> {
    return prisma.job.findMany({ where: { createdBy: userId } });
  }

  async delete(id: string): Promise<Job> {
    return prisma.job.delete({ where: { id } });
  }
}
