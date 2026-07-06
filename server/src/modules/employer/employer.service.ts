import prisma from "../../../prisma/index.js";
import { Employer, Role } from "../../../prisma/generated/prisma/index.js";
import { CreateEmployerInput, UpdateEmployerInput } from "./employer.validation.js";
import { ApiError } from "../../utils/apiError.utils.js";

export class EmployerService {

  async createEmployer(
    userId: string,
    data: CreateEmployerInput
  ): Promise<Employer> {
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }


    const existingEmployer = await prisma.employer.findUnique({
      where: { userId },
    });

    if (existingEmployer) {
      throw new ApiError(400, "User already has an employer profile");
    }


    const employer = await prisma.$transaction(async (tx) => {
      // Create employer profile
      const newEmployer = await tx.employer.create({
        data: {
          userId,
          companyName: data.companyName,
          companyLogo: data.companyLogo || null,
          website: data.website || null,
          industry: data.industry || null,
          size: data.size || null,
          description: data.description || null,
          location: data.location || null,
        },
      });


      await tx.user.update({
        where: { id: userId },
        data: { role: Role.EMPLOYER },
      });

      return newEmployer;
    });

    return employer;
  }


  async updateEmployer(
    userId: string,
    data: UpdateEmployerInput
  ): Promise<Employer> {
    
    const employer = await prisma.employer.findUnique({
      where: { userId },
    });

    if (!employer) {
      throw new ApiError(404, "Employer profile not found");
    }


    const updatedEmployer = await prisma.employer.update({
      where: { userId },
      data: {
        companyName: data.companyName || undefined,
        companyLogo: data.companyLogo !== undefined ? data.companyLogo : undefined,
        website: data.website !== undefined ? data.website : undefined,
        industry: data.industry !== undefined ? data.industry : undefined,
        size: data.size !== undefined ? data.size : undefined,
        description: data.description !== undefined ? data.description : undefined,
        location: data.location !== undefined ? data.location : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return updatedEmployer;
  }


  async getEmployerByUserId(userId: string): Promise<Employer | null> {
    const employer = await prisma.employer.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        jobs: {
          where: { isActive: true },
          orderBy: { postedAt: "desc" },
          take: 10,
        },
      },
    });

    return employer;
  }


  async getEmployerById(id: string): Promise<Employer | null> {
    const employer = await prisma.employer.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        jobs: {
          where: { isActive: true },
          orderBy: { postedAt: "desc" },
          include: {
            applications: {
              select: {
                id: true,
                status: true,
              },
            },
          },
        },
      },
    });

    return employer;
  }


  async getAllEmployers(options?: {
    page?: number;
    limit?: number;
    search?: string;
    industry?: string;
  }): Promise<{ data: Employer[]; total: number }> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;


    const where: any = {};

    if (options?.search) {
      where.OR = [
        { companyName: { contains: options.search, mode: "insensitive" } },
        { description: { contains: options.search, mode: "insensitive" } },
        { location: { contains: options.search, mode: "insensitive" } },
      ];
    }

    if (options?.industry) {
      where.industry = options.industry;
    }

    const [data, total] = await Promise.all([
      prisma.employer.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
          jobs: {
            where: { isActive: true },
            select: {
              id: true,
              title: true,
              postedAt: true,
            },
            orderBy: { postedAt: "desc" },
            take: 5,
          },
        },
        skip,
        take: limit,
        orderBy: { companyName: "desc" },
      }),
      prisma.employer.count({ where }),
    ]);

    return { data, total };
  }


  async deleteEmployer(id: string): Promise<Employer> {
    
    const employer = await prisma.employer.findUnique({
      where: { id },
    });

    if (!employer) {
      throw new ApiError(404, "Employer profile not found");
    }


    return await prisma.$transaction(async (tx) => {
      
      const deletedEmployer = await tx.employer.delete({
        where: { id },
      });


      await tx.user.update({
        where: { id: deletedEmployer.userId },
        data: { role: Role.USER },
      });

      return deletedEmployer;
    });
  }


  async hasEmployerProfile(userId: string): Promise<boolean> {
    const employer = await prisma.employer.findUnique({
      where: { userId },
      select: { id: true },
    });
    return !!employer;
  }


  async getEmployerStats(userId: string): Promise<any> {
    const employer = await prisma.employer.findUnique({
      where: { userId },
      include: {
        jobs: {
          include: {
            applications: true,
          },
        },
      },
    });

    if (!employer) {
      throw new ApiError(404, "Employer profile not found");
    }

    const totalJobs = employer.jobs.length;
    const totalApplications = employer.jobs.reduce(
      (acc, job) => acc + job.applications.length,
      0
    );

    const activeJobs = employer.jobs.filter((job) => job.isActive).length;


    const applicationsByStatus = employer.jobs.reduce((acc, job) => {
      job.applications.forEach((app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return {
      totalJobs,
      activeJobs,
      totalApplications,
      applicationsByStatus,
      companyName: employer.companyName,
      isVerified: employer.isVerified,
    };
  }
}

export const employerService = new EmployerService();