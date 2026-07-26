import prisma from "../../../prisma/index.js";
import { AuthProvider, Role } from "../../../prisma/generated/prisma/index.js";
import PasswordUtils from "../../utils/password.utils.js";
import { CreateUserModel, UserDto } from "./user.validation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

export class UserService {
  async create(
    data: CreateUserModel,
    role: Role,
  ): Promise<{ success: boolean; message?: string; data?: UserDto }> {
    if (!data.password && (!data.provider || data.provider === AuthProvider.CREDENTIALS)) {
      throw new Error("Password is required to create a user");
    }

    const emailVerifyToken = crypto.randomBytes(32).toString("hex");

    const hashedPassword = data.password ? await PasswordUtils.hashPassword(data.password) : null;

    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        role: role,
        provider: data.provider ?? AuthProvider.CREDENTIALS,
        providerId: data.providerId ?? null,
        emailVerifyToken: emailVerifyToken,
        isEmailVerified: data.provider === AuthProvider.GOOGLE,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isEmailVerified: true,
      },
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

  generateToken(user: { id: string; email: string; role: Role }): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );
  }

  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async verifyEmail(token: string): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: { emailVerifyToken: token },
    });

    if (!user) {
      return false;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerifyToken: null,
      },
    });

    return true;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{
    token: string;
    user: Omit<CreateUserModel, "password">;
  } | null> {
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
      { expiresIn: "1d" },
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
    id: string,
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

  async forgotPassword(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return false; 
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000);  // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpiry: resetTokenExpiry,
      },
    });

    // Send password reset email
    // await emailService.sendPasswordResetEmail(user.email, resetToken);

    return true;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiry: {
          gt: new Date(), 
        },
      },
    });

    if (!user) {
      return false;
    }

    const hashedPassword = await PasswordUtils.hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiry: null,
      },
    });

    return true;
  }
}

export const userService = new UserService();
