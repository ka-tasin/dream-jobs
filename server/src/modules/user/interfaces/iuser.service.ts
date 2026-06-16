import { Role } from "../../../../prisma/generated/prisma/index.js";
import { CustomResponse } from "../../../dtos/custom-response.js";
import { UserDto } from "../../../dtos/user.dto.js";
import { CreateUserModel } from "../user.model.js";

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
