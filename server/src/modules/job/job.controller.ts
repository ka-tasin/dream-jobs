import { Request, Response, NextFunction } from "express";
import { Role } from "../../../prisma/generated/prisma/index.js";
import { jobService } from "./job.service.js";
import prisma from "../../../prisma/index.js";

export class JobController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as any).user;

      const employer = await prisma.employer.findUnique({
        where: { userId: user.id },
      });

      if (!employer) {
        res.status(403).json({
          success: false,
          message:
            "User does not have an employer profile. Please complete your employer profile first.",
        });
        return;
      }

      const data = {
        ...req.body,
        employerId: employer.id,
      };

      const job = await jobService.createJob(data);
      res.status(201).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const search = (req.query.search || req.query.q || "") as string;
      const jobs = await jobService.listJobs(search);
      res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const job = await jobService.getJobById(id);

      if (!job) {
        res.status(404).json({
          success: false,
          message: "Job not found",
        });
        return;
      }

      res.status(200).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  }

  async getByCreator(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.params;

      const employer = await prisma.employer.findUnique({
        where: { userId },
      });

      if (!employer) {
        res.status(404).json({
          success: false,
          message: "Employer profile not found for this user",
        });
        return;
      }

      const jobs = await jobService.listJobsByEmployer(employer.id);
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
        res.status(404).json({
          success: false,
          message: "Job not found",
        });
        return;
      }

      const employer = await prisma.employer.findUnique({
        where: { userId: user.id },
      });

      if (
        !employer ||
        (user.role === Role.EMPLOYER && job.employerId !== employer.id)
      ) {
        res.status(403).json({
          success: false,
          message: "Forbidden: cannot delete this job",
        });
        return;
      }

      await jobService.deleteJob(id);
      res.status(200).json({
        success: true,
        message: "Job deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const jobController = new JobController();
