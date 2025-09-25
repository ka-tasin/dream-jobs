import { inject, injectable } from "inversify";
import { TYPES } from "../config/ioc.types";
import { IUnitOfService } from "../services/interfaces/iunitOf.service";
import { Role } from "../../prisma/generated/prisma";
import { NextFunction, Request, Response } from "express";

@injectable()
export default class RoleMiddleware {
  constructor(
    @inject(TYPES.IUnitOfService) private unitOfService: IUnitOfService
  ) {}

  authorize(roles: Role[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({ message: "Unauthorized access" });
        return;
      }

      const payload = this.unitOfService.User.verifyToken(token);
      if (!payload) {
        res.status(401).json({ message: "Invalid token" });
        return;
      }

      if (!roles.includes(payload.role as Role)) {
        res.status(403).json({ message: "Forbidden: insufficient role" });
        return;
      }

      (req as any).user = payload;
      next();
    };
  }
}
