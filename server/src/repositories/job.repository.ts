import { injectable } from "inversify";
import prisma from "../../prisma";
import { Job } from "../../prisma/generated/prisma";
import { IJobRepository } from "./interfaces/ijob.repository";

@injectable()
export default class JobRepository implements IJobRepository {
  async create(data: Omit<Job, "id" | "postedAt">): Promise<Job> {
    return prisma.job.create({ data });
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
