import { UserDto } from "../dtos/user.dto";
import prisma from "../../prisma";
import { IUserRepository } from "./interfaces/iuser.repository";
import { CreateUserModel } from "../models/user.model";
import { Role } from "../../prisma/generated/prisma";

export default class UserRepository implements IUserRepository {
  async create(data: CreateUserModel): Promise<UserDto | null> {
    return prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<Partial<CreateUserModel> | null> {
    return prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, password: true },
    });
  }

  async findById(id: string): Promise<Partial<CreateUserModel> | null> {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true },
    });
  }

  async updateRole(id: string): Promise<UserDto | null> {
    return prisma.user.update({
      where: { id },
      data: { role: Role.EMPLOYER },
      select: { id: true, name: true, email: true, role: true },
    });
  }
}
