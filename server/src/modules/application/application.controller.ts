import { Request, Response, NextFunction } from "express";
import { applicationService } from "./application.service.js";

export class ApplicationController {
  async getApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const applications =
        await applicationService.getApplicationsForEmployer(user.id);

      res.json({ success: true, data: applications });
    } catch (err) {
      next(err);
    }
  }

  async getApplicationsByJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { jobId } = req.params;
      const user = (req as any).user;

      if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const applications =
        await applicationService.getApplicationsForJob(jobId);

      res.json({ success: true, data: applications });
    } catch (err) {
      next(err);
    }
  }

  async apply(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as any).user; // JWT payload
      const { jobId, resumeUrl, coverLetter } = req.body;

      const application = await applicationService.applyToJob(
        user.id,
        jobId,
        resumeUrl,
        coverLetter
      );

      res.status(201).json({ success: true, data: application });
    } catch (err: any) {
      next(err);
    }
  }

  async getUserApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as any).user;
      const apps = await applicationService.getUserApplications(user.id);
      res.status(200).json({ success: true, data: apps });
    } catch (err) {
      next(err);
    }
  }

  async getJobApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { jobId } = req.params;
      const apps = await applicationService.getJobApplications(jobId);
      res.status(200).json({ success: true, data: apps });
    } catch (err) {
      next(err);
    }
  }
}

export const applicationController = new ApplicationController();
