import prisma from "../../../prisma/index.js";
import { ApiError } from "../../utils/apiError.utils.js";

export class AdminService {
  async getAllUsers(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ users: any[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          employer: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  async getPlatformStats(): Promise<{
    totalUsers: number;
    totalJobs: number;
    totalEmployers: number;
    totalApplications: number;
  }> {
    const [totalUsers, totalJobs, totalEmployers, totalApplications] =
      await Promise.all([
        prisma.user.count(),
        prisma.job.count(),
        prisma.employer.count(),
        prisma.application.count(),
      ]);

    return {
      totalUsers,
      totalJobs,
      totalEmployers,
      totalApplications,
    };
  }

  async deleteUser(id: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    await prisma.user.delete({
      where: { id },
    });
  }
}

export const adminService = new AdminService();
