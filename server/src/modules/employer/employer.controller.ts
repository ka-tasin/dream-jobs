import { Request, Response, NextFunction } from "express";
import { employerService } from "./employer.service.js";

export class EmployerController {
  async createEmployer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = (req as any).user;
      const data = req.body;

      const hasProfile = await employerService.hasEmployerProfile(user.id);
      if (hasProfile) {
        res.status(400).json({
          success: false,
          message: "You already have an employer profile",
        });
        return;
      }

      const employer = await employerService.createEmployer(user.id, data);

      res.status(201).json({
        success: true,
        message: "Employer profile created successfully",
        data: employer,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEmployer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = (req as any).user;
      const data = req.body;

      const employer = await employerService.updateEmployer(user.id, data);

      res.status(200).json({
        success: true,
        message: "Employer profile updated successfully",
        data: employer,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyEmployerProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = (req as any).user;

      const employer = await employerService.getEmployerByUserId(user.id);

      if (!employer) {
        res.status(404).json({
          success: false,
          message: "Employer profile not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: employer,
      });
    } catch (error) {
      next(error);
    }
  }

  async getEmployerByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params;

      const employer = await employerService.getEmployerByUserId(userId);

      if (!employer) {
        res.status(404).json({
          success: false,
          message: "Employer profile not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: employer,
      });
    } catch (error) {
      next(error);
    }
  }

  async getEmployerById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const employer = await employerService.getEmployerById(id);

      if (!employer) {
        res.status(404).json({
          success: false,
          message: "Employer profile not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: employer,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllEmployers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;
      const industry = req.query.industry as string;

      const result = await employerService.getAllEmployers({
        page,
        limit,
        search,
        industry,
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteEmployer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      await employerService.deleteEmployer(id);

      res.status(200).json({
        success: true,
        message: "Employer profile deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getEmployerStats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = (req as any).user;

      const stats = await employerService.getEmployerStats(user.id);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const employerController = new EmployerController();