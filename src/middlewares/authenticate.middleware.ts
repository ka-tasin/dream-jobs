import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/ioc.types";
import { IUnitOfService } from "../services/interfaces/iunitOf.service";

@injectable()
export default class AuthMiddleware {
  constructor(
    @inject(TYPES.IUnitOfService) private unitOfService: IUnitOfService
  ) {}

  authenticate(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Token missing" });
      return;
    }

    const payload = this.unitOfService.User.verifyToken(token);
    if (!payload) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    (req as any).user = payload;
    next();
  }
}
