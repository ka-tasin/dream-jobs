import { inject, injectable } from "inversify";
import { TYPES } from "../config/ioc.types";
import { Job } from "../../prisma/generated/prisma";
import { IJobService } from "./interfaces/ijob.service";
import IUnitOfWork from "../repositories/interfaces/iunitofwork.repository";

@injectable()
export default class JobService implements IJobService {
  constructor(@inject(TYPES.IUnitOfWork) private unitOfWork: IUnitOfWork) {}

  async createJob(data: Omit<Job, "id" | "postedAt">): Promise<Job> {
    return this.unitOfWork.Job.create(data);
  }

  async getJobById(id: string): Promise<Job | null> {
    return this.unitOfWork.Job.findById(id);
  }

  async listJobs(): Promise<Job[]> {
    return this.unitOfWork.Job.findAll();
  }

  async listJobsByCreator(userId: string): Promise<Job[]> {
    return this.unitOfWork.Job.findByCreator(userId);
  }

  async deleteJob(id: string): Promise<Job> {
    return this.unitOfWork.Job.delete(id);
  }
}
