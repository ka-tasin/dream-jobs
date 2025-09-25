import { Role } from "../../prisma";

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role?: Role;
}
