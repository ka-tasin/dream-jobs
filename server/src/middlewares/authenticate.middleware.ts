import { Request, Response, NextFunction } from "express";
import { userService } from "../modules/user/user.service.js";

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: "Unauthorized access" });
    return;
  }

  const payload = userService.verifyToken(token);
  if (!payload) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }

  (req as any).user = payload;
  next();
};
