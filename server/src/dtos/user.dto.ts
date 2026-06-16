import { Role } from "../../prisma/generated/prisma/index.js";

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role?: Role;
}
