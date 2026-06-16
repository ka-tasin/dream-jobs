import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../config/ioc.types.js";
import { IUnitOfService } from "../../services/interfaces/iunitOf.service.js";
import { CustomResponse } from "../../dtos/custom-response.js";
import { UserDto } from "../../dtos/user.dto.js";
import { CreateUserModel } from "../user/user.model.js";
import { Role } from "../../../prisma/generated/prisma/index.js";
import { createUserSchema } from "../user/user.validation.js";
import { z } from "zod";

@injectable()
export default class AccountController {
  constructor(
    @inject(TYPES.IUnitOfService) private unitOfService: IUnitOfService,
  ) {}

  async register(
    req: Request,
    res: Response,
  ): Promise<Response<CustomResponse<UserDto>>> {
    try {
      const validatedData = createUserSchema.parse(req.body) as CreateUserModel;

      const user = await this.unitOfService.User.getUserByEmail(
        validatedData.email,
      );

      if (user)
        return res.status(409).json({ message: "User Already exists!" });

      const newUser = await this.unitOfService.User.create(
        validatedData,
        Role.USER,
      );

      if (!newUser)
        return res.status(400).json({ message: "Failed to create user!" });

      return res.status(200).json({
        success: true,
        message: "User created!",
        data: newUser,
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      throw error;
    }
  }

  async login(
    req: Request,
    res: Response,
  ): Promise<Response<CustomResponse<UserDto | null>>> {
    const { email, password } = req.body;
    const user = await this.unitOfService.User.login(email, password);

    if (!user)
      return res.status(401).json({ message: "Invalid email or password!" });

    const response = {
      success: true,
      message: "Login successfull!",
      data: user,
    };

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      data: user,
    });
  }

  async verifyToken(
    req: Request,
    res: Response,
  ): Promise<Response<CustomResponse<UserDto | null>>> {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing!" });

    const payload = this.unitOfService.User.verifyToken(token);

    if (!payload) res.status(401).json({ message: "Invalid token!" });

    return res
      .status(200)
      .json({ success: true, message: "Token valid", data: payload });
  }
}
