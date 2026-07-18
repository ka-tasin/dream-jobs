import { Request, Response, NextFunction } from "express";
import { userService } from "../user/user.service.js";
import { Role } from "../../../prisma/generated/prisma/index.js";

export class AccountController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const validatedData = req.body;

      const user = await userService.getUserByEmail(validatedData.email);
      if (user) {
        res.status(409).json({ message: "User Already exists!" });
        return;
      }

      const newUser = await userService.create(validatedData, Role.USER);

      if (!newUser || !newUser.success) {
        res
          .status(400)
          .json({ message: newUser?.message || "Failed to create user!" });
        return;
      }

      res.status(201).json({
        success: true,
        message: "User created!",
        data: newUser.data,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);

      if (!result) {
        res.status(401).json({ message: "Invalid email or password!" });
        return;
      }

      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: "Login successful!",
        data: { user: result.user },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Clear the cookie named 'token'
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(200).json({
        success: true,
        message: "Logged out successfully!",
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({ message: "Token missing!" });
        return;
      }

      const payload = userService.verifyToken(token);
      if (!payload) {
        res.status(401).json({ message: "Invalid token!" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Token valid",
        data: payload,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const accountController = new AccountController();
