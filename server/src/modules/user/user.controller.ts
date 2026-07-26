import { Request, Response, NextFunction } from "express";
import { userService } from "./user.service.js";

export class UserController {
  async updateUserRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await userService.updateUserRole(id);

      if (!result) {
        res.status(400).json({
          success: false,
          data: null,
          message: "Upgrade to employer failed!",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
