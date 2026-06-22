import { Request, Response, NextFunction } from "express";
import { Role } from "../../../prisma/generated/prisma/index.js";
import { jobService } from "./job.service.js";

export class JobController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as any).user;
      const data = { ...req.body, createdBy: user.id };
      const job = await jobService.createJob(data);
      res.status(201).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const jobs = await jobService.listJobs();
      res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const job = await jobService.getJobById(id);
      if (!job) {
        res.status(404).json({ message: "Job not found" });
        return;
      }
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  }

  async getByCreator(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const jobs = await jobService.listJobsByCreator(userId);
      res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as any).user;
      const { id } = req.params;

      const job = await jobService.getJobById(id);
      if (!job) {
        res.status(404).json({ message: "Job not found" });
        return;
      }

      if (user.role === Role.EMPLOYER && job.createdBy !== user.id) {
        res
          .status(403)
          .json({ message: "Forbidden: cannot delete other employer's job" });
        return;
      }

      await jobService.deleteJob(id);
      res.status(200).json({ success: true, message: "Job deleted" });
    } catch (error) {
      next(error);
    }
  }
}

export const jobController = new JobController();
