import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/ioc.types";
import { IUnitOfService } from "../services/interfaces/iunitOf.service";
import { CustomResponse } from "../dtos/custom-response";
import { UserDto } from "../dtos/user.dto";
import { CreateUserModel } from "../models/user.model";
import { Role } from "../../prisma/generated/prisma";

@injectable()
export default class AccountController {
  constructor(
    @inject(TYPES.IUnitOfService) private unitOfService: IUnitOfService
  ) {}

  async register(
    req: Request,
    res: Response
  ): Promise<Response<CustomResponse<UserDto>>> {
    const data = req.body as CreateUserModel;
    const user = await this.unitOfService.User.getUserByEmail(data.email);

    if (user) return res.status(409).json({ message: "User Already exists!" });

    const newUser = await this.unitOfService.User.create(data, Role.USER);

    if (!newUser)
      return res.status(400).json({ message: "Failed to create user!" });

    return res.status(200).json({
      success: true,
      message: "User created!",
      data: newUser,
    });
  }

  async login(
    req: Request,
    res: Response
  ): Promise<Response<CustomResponse<UserDto | null>>> {
    const { email, password } = req.body;
  }
}
