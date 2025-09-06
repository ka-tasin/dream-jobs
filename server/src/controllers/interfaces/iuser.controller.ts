import { UserDto } from "../../dtos/user.dto";

export interface IUserController {
  getUserById: Promise<UserDto>;
  getUserByEmail: Promise<UserDto>;
}
