import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../config/ioc.types.js";
import { IUnitOfService } from "../../services/interfaces/iunitOf.service.js";

@injectable()
export default class ApplicationController {
  constructor(
    @inject(TYPES.IUnitOfService) private unitOfService: IUnitOfService
  ) {}

  async getApplications(req: Request, res: Response) {
    try {
      const user = (req as any).user;
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

  async apply(req: Request, res: Response): Promise<Response> {
    try {
      const user = (req as any).user; // JWT payload
      const { jobId, resumeUrl, coverLetter } = req.body;

      const application = await this.unitOfService.Application.applyToJob(
        user.id,
        jobId,
        resumeUrl,
        coverLetter
      );

      return res.status(201).json({ success: true, data: application });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  async getUserApplications(req: Request, res: Response): Promise<Response> {
    const user = (req as any).user;
    const apps = await this.unitOfService.Application.getUserApplications(
      user.id
    );
    return res.status(200).json({ success: true, data: apps });
  }

  async getJobApplications(req: Request, res: Response): Promise<Response> {
    const { jobId } = req.params;
    const apps = await this.unitOfService.Application.getJobApplications(jobId);
    return res.status(200).json({ success: true, data: apps });
  }
}
