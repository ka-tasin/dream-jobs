import { Request, Response } from "express";
import container from "../config/ioc.config";
import { UserDto } from "../dtos/user.dto";
import { IUnitOfService } from "../services/interfaces/iunitOf.service";
import { IUserController } from "./interfaces/iuser.controller";
import { CustomResponse } from "../dtos/custom-response";
import { TYPES } from "../config/ioc.types";

export default class UserController implements IUserController {
  constructor(
    private unitOfService = container.get<IUnitOfService>(TYPES.IUserService)
  ) {}

  // async getUserById(
  //   req: Request,
  //   res: Response
  // ): Promise<Response<CustomResponse<UserDto>>> {
  //   const id = req?.params?.id;

  //   if (id) {
  //     return res.status(400).json({ message: "User ID is required!" });
  //   }

  //   const user = await this.unitOfService.User.findById(id);

  //   if (!user) return res.status(400).json({ message: "User not found!" });

  //   const response: CustomResponse<UserDto> = {
  //     success: true,
  //     data: user,
  //   };
  // }
}
