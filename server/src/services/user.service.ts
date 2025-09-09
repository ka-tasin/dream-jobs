import { inject, injectable } from "inversify";
import IUnitOfWork from "../repositories/interfaces/iunitofwork.repository";
import { TYPES } from "../config/ioc.types";
import { CreateUserModel } from "../models/user.model";
import { CustomResponse } from "../dtos/custom-response";
import { Role } from "../../prisma/generated/prisma";

@injectable()
export default class UserService {
  constructor(@inject(TYPES.IUnitOfWork) private unitOfWork: IUnitOfWork) {}

  async create(
    data: CreateUserModel,
    role: Role
  ): Promise<CustomResponse<UserDto>> {
    const hashedPassword = data.password;
  }
}
