import { UserDto } from "../../dtos/user.dto";
import { CreateUserModel } from "../../models/user.model";

export interface IUserService {
  create(data: CreateUserModel, role: string): Promise<UserDto | null>;
  getUserByEmail(email: string): Promise<UserDto | null>;
}
