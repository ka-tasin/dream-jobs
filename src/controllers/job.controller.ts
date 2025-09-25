// controllers/job.controller.ts
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/ioc.types";
import { Role } from "../../prisma/generated/prisma";
import { IUnitOfService } from "../services/interfaces/iunitOf.service";

@injectable()
export default class JobController {
  constructor(
    @inject(TYPES.IUnitOfService) private unitOfService: IUnitOfService
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    const user = (req as any).user; // payload from JWT
    if (![Role.EMPLOYER, Role.ADMIN].includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: only employer or admin can create jobs" });
    }

    const data = { ...req.body, createdBy: user.id }; // auto-assign creator
    const job = await this.unitOfService.Job.createJob(data);
    return res.status(201).json({ success: true, data: job });
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    const jobs = await this.unitOfService.Job.listJobs();
    return res.status(200).json({ success: true, data: jobs });
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const job = await this.unitOfService.Job.getJobById(id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    return res.status(200).json({ success: true, data: job });
  }

  async getByCreator(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params;
    const jobs = await this.unitOfService.Job.listJobsByCreator(userId);
    return res.status(200).json({ success: true, data: jobs });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const user = (req as any).user;
    const { id } = req.params;

    const job = await this.unitOfService.Job.getJobById(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (user.role === Role.EMPLOYER && job.createdBy !== user.id) {
      return res
        .status(403)
        .json({ message: "Forbidden: cannot delete other employer's job" });
    }

    await this.unitOfService.Job.deleteJob(id);
    return res.status(200).json({ success: true, message: "Job deleted" });
  }
}
