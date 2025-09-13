import { CustomResponse } from "../../dtos/custom-response";
import { UserDto } from "../../dtos/user.dto";
import { CreateUserModel } from "../../models/user.model";

export interface IUserService {
  create(data: CreateUserModel, role: string): Promise<CustomResponse<UserDto>>;
  getUserByEmail(email: string): Promise<UserDto | null>;
}
