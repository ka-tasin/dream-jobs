import { UserDto } from "../../dtos/user.dto";

export interface IUserRepository {
  create(data: UserDto): Promise<UserDto | null>;
  findByEmail(email: string): Promise<UserDto | null>;
}
