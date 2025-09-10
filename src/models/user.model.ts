import { Role } from "../../prisma/generated/prisma";

export interface CreateUserModel {
  id: string;
  name: string;
  email: string;
  role?: Role;
  password?: string | null;
}
