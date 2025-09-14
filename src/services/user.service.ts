import { inject, injectable } from "inversify";
import IUnitOfWork from "../repositories/interfaces/iunitofwork.repository";
import { TYPES } from "../config/ioc.types";
import { CreateUserModel } from "../models/user.model";
import { CustomResponse } from "../dtos/custom-response";
import { Role } from "../../prisma/generated/prisma";
import PasswordUtils from "../utils/password.utils";
import { UserDto } from "../dtos/user.dto";
import { IUserService } from "./interfaces/iuser.service";
import bcrypt from "bcrypt";

@injectable()
export default class UserService implements IUserService {
  constructor(@inject(TYPES.IUnitOfWork) private unitOfWork: IUnitOfWork) {}

  async create(
    data: CreateUserModel,
    role: Role
  ): Promise<CustomResponse<UserDto>> {

    if (!data.password) {
      throw new Error("Password is required to create a user");
    }

    const hashedPassword = await PasswordUtils.hashPassword(data.password);

    const user = await this.unitOfWork.transaction(
      async (transactionClient) => {
        return transactionClient.user.create({
          data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: role,
          },
          select: { id: true, name: true, email: true, role: true },
        });
      }
    );

    if (!user)
      return {
        success: false,
        message: "No user added!",
      };

    return {
      success: true,
      data: user,
    };
  }

  async getUserByEmail(email: string): Promise<UserDto | null> {
    const user = await this.unitOfWork.User.findByEmail(email);

    if (!user) return null;

    return user;
  }

  async login(email: string, password: string): Promise<{ token: string user: Partial<CreateUserModel>}> {
    const user = await this.unitOfWork.User.findByEmail(email);

    if (!user) return null;

    const isUserMatch = bcrypt.compare(password, user.password);
  }
  o;
}
