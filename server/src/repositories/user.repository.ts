import { UserDto } from "../dtos/user.dto";
import prisma from "../../prisma";

export default class UserRepository {
  async create(data: UserDto): Promise<UserDto | null> {
    return prisma.user.create({
      data,
    });
  }
}
