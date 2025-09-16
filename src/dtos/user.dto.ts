import { Role } from "../../prisma/generated/prisma";

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role?: Role;
}
