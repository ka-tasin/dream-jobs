import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/ioc.types";
import { IUnitOfService } from "../services/interfaces/iunitOf.service";

@injectable()
export default class ApplicationController {
  constructor(
    @inject(TYPES.IUnitOfService) private unitOfService: IUnitOfService
  ) {}

  async getApplications(req: Request, res: Response) {
    try {
      const user = (req as any).user; // from JWT
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const applications =
        await this.unitOfService.Application.getApplicationsForEmployer(
          user.id
        );

      return res.json({ success: true, data: applications });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getApplicationsByJob(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const user = (req as any).user;

      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const applications =
        await this.unitOfService.Application.getApplicationsForJob(jobId);

      return res.json({ success: true, data: applications });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  getUserApplications = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const applications =
        await this.unitOfService.Application.getUserApplications(id);

      res.status(200).json({
        success: true,
        data: applications,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch user applications",
        error: error.message,
      });
    }
  };

  applyForJob = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const { jobId, resumeUrl, coverLetter } = req.body;

      const application = await this.unitOfService.Application.applyForJob(
        user.id,
        jobId,
        resumeUrl,
        coverLetter
      );

      res.status(201).json({ success: true, data: application });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
