import { Request, Response } from "express";
import { UserDto } from "../dtos/user.dto";
import { IUnitOfService } from "../services/interfaces/iunitOf.service";
import { IUserController } from "./interfaces/iuser.controller";
import { CustomResponse } from "../dtos/custom-response";
import { TYPES } from "../config/ioc.types";
import { inject, injectable } from "inversify";

@injectable()
export default class UserController implements IUserController {
  constructor(
    @inject(TYPES.IUnitOfService) private unitOfService: IUnitOfService // private unitOfService = container.get<IUnitOfService>(TYPES.IUserService)
  ) {}

  async updateUserRole(
    req: Request,
    res: Response
  ): Promise<Response<CustomResponse<UserDto | null>>> {
    const { id } = req.params;
    const result = await this.unitOfService.User.updateUserRole(id);

    if (!result)
      return res.status(400).json({
        success: true,
        data: null,
        message: "Upgrade to employer failed!",
      });

    return res.status(200).json({
      success: true,
      data: result,
    });
  }
  //   async getUserById(
  //     req: Request,
  //     res: Response
  //   ): Promise<Response<CustomResponse<UserDto>>> {
  //     const id = req?.params?.id;

  //     if (id) {
  //       return res.status(400).json({ message: "User ID is required!" });
  //     }

  //     const user = await this.unitOfService.User.findById(id);

  //     if (!user) return res.status(400).json({ message: "User not found!" });

  //     const response: CustomResponse<UserDto> = {
  //       success: true,
  //       data: user,
  //     };
  //   }
}
