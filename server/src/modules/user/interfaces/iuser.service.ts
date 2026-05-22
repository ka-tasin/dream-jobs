import { Role } from "../../../prisma/generated/prisma";
import { CustomResponse } from "../../dtos/custom-response";
import { UserDto } from "../../dtos/user.dto";
import { CreateUserModel } from "../../models/user.model";

export interface IUserService {
  create(data: CreateUserModel, role: string): Promise<CustomResponse<UserDto>>;

  getUserByEmail(email: string): Promise<Partial<CreateUserModel> | null>;

  login(
    email: string,
    password: string
  ): Promise<{ token: string; user: Partial<CreateUserModel> } | null>;

  verifyToken(token: string): { id: string; email: string; role: Role } | null;

  updateUserRole(
    id: string
  ): Promise<{ id: string; email: string; role: Role } | null>;
}
