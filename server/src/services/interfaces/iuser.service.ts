import { UserDto } from "../../dtos/user.dto";

export interface IUserService {
  getUserById: Promise<UserDto>;
  getUserByEmail: Promise<UserDto>;
}
