import { Request, Response, NextFunction } from "express";
import { Role } from "../../prisma/generated/prisma/index.js";

export const authorize = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized: User not authenticated" });
      return;
    }

    if (!roles.includes(user.role as Role)) {
      res.status(403).json({ message: "Forbidden: insufficient role" });
      return;
    }

    next();
  };
};
