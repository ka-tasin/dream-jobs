import { inject, injectable } from "inversify";
import IUnitOfWork from "../repositories/interfaces/iunitofwork.repository";
import { TYPES } from "../config/ioc.types";
import { CreateUserModel } from "../models/user.model";
import { CustomResponse } from "../dtos/custom-response";
import { AuthProvider, Role } from "../../prisma/generated/prisma";
import PasswordUtils from "../utils/password.utils";
import { UserDto } from "../dtos/user.dto";
import { IUserService } from "./interfaces/iuser.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
            provider: data.provider ?? AuthProvider.CREDENTIALS,
            providerId: data.providerId ?? null,
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

  async getUserByEmail(
    email: string
  ): Promise<Partial<CreateUserModel> | null> {
    const user = await this.unitOfWork.User.findByEmail(email);

    if (!user) return null;

    return user;
  }

  async login(
    email: string,
    password: string
  ): Promise<{ token: string; user: Partial<CreateUserModel> } | null> {
    const user = await this.unitOfWork.User.findByEmail(email);

    if (!user || !user.password) {
      return null;
    }

    const isUserMatch = bcrypt.compare(password, user.password);
    if (!isUserMatch) return null;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  verifyToken(token: string): { id: string; email: string; role: Role } | null {
    try {
      return jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
        email: string;
        role: Role;
      };
    } catch (err) {
      return null;
    }
  }

  async updateUserRole(
    id: string
  ): Promise<{ id: string; email: string; role: Role } | null> {
    const user = await this.unitOfWork.User.findById(id);
    if (!user) return null;

    const updatedUser = await this.unitOfWork.User.updateRole(id);

    if (!updatedUser) return null;

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role as Role,
    };
  }
}
