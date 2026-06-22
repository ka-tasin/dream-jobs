import prisma from "../../../prisma/index.js";
import { AuthProvider, Role } from "../../../prisma/generated/prisma/index.js";
import PasswordUtils from "../../utils/password.utils.js";
import { CreateUserModel, UserDto } from "./user.validation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export class UserService {
  async create(
    data: CreateUserModel,
    role: Role
  ): Promise<{ success: boolean; message?: string; data?: UserDto }> {
    if (!data.password) {
      throw new Error("Password is required to create a user");
    }

    const hashedPassword = await PasswordUtils.hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword, 
        role: role,
        provider: data.provider ?? AuthProvider.CREDENTIALS,
        providerId: data.providerId ?? null,
      },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return {
        success: false,
        message: "No user added!",
      };
    }

    return {
      success: true,
      data: user,
    };
  }

  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async login(
    email: string,
    password: string
  ): Promise<{ token: string; user: Omit<CreateUserModel, "password"> } | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return null;
    }

    const isUserMatch = await bcrypt.compare(password, user.password);
    if (!isUserMatch) return null;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword as any };
  }

  verifyToken(token: string): { id: string; email: string; role: Role } | null {
    try {
      return jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
        email: string;
        role: Role;
      };
    } catch (err) {
      return null;
    }
  }

  async updateUserRole(
    id: string
  ): Promise<{ id: string; email: string; role: Role } | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: Role.EMPLOYER },
      select: { id: true, email: true, role: true },
    });

    if (!updatedUser) return null;

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role as Role,
    };
  }
}

export const userService = new UserService();
