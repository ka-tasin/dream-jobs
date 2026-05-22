import { UserDto } from "../../dtos/user.dto";
import { CreateUserModel } from "../../models/user.model";

export interface IUserRepository {
  create(data: UserDto): Promise<UserDto | null>;
  findByEmail(email: string): Promise<Partial<CreateUserModel> | null>;
  findById(id: string): Promise<Partial<CreateUserModel> | null>;
  updateRole(id: string): Promise<UserDto | null>;
}
