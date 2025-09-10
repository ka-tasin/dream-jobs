import { UserDto } from "../dtos/user.dto";
import prisma from "../../prisma";
import { IUserRepository } from "./interfaces/iuser.repository";
import { CreateUserModel } from "../models/user.model";

export default class UserRepository implements IUserRepository {
  async create(data: CreateUserModel): Promise<UserDto | null> {
    return prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<UserDto | null> {
    return prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });
  }
}
