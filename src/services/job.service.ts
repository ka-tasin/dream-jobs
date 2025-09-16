import { inject, injectable } from "inversify";
import { TYPES } from "../config/ioc.types";
import { Job } from "../../prisma/generated/prisma";
import { IJobRepository } from "../repositories/interfaces/ijob.repository";
import { IJobService } from "./interfaces/ijob.service";

@injectable()
export default class JobService implements IJobService {
  constructor(
    @inject(TYPES.IJobRepository) private jobRepository: IJobRepository
  ) {}

  async createJob(data: Omit<Job, "id" | "postedAt">): Promise<Job> {
    return this.jobRepository.create(data);
  }

  async getJobById(id: string): Promise<Job | null> {
    return this.jobRepository.findById(id);
  }

  async listJobs(): Promise<Job[]> {
    return this.jobRepository.findAll();
  }

  async listJobsByCreator(userId: string): Promise<Job[]> {
    return this.jobRepository.findByCreator(userId);
  }

  async deleteJob(id: string): Promise<Job> {
    return this.jobRepository.delete(id);
  }
}
