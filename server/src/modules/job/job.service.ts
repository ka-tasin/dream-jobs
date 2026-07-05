import prisma from "../../../prisma/index.js";
import { Job } from "../../../prisma/generated/prisma/index.js";

export class JobService {
  async createJob(data: Omit<Job, "id" | "postedAt" | "updatedAt"> & { employerId: string }): Promise<Job> {
    return prisma.job.create({
      data: {
        ...data,
        deadline: data.deadline ? new Date(data.deadline) : null,
        salary: data.salary ? parseFloat(data.salary as any) : null,
        salaryMax: data.salaryMax ? parseFloat(data.salaryMax as any) : null,
        skills: Array.isArray(data.skills) ? data.skills : [],
      },
      include: {
        employer: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async getJobById(id: string): Promise<Job | null> {
    return prisma.job.findUnique({
      where: { id },
      include: {
        employer: {
          include: {
            user: true,
          },
        },
        applications: {
          include: {
            user: true,
          },
        },
        savedBy: true,
      },
    });
  }

  async listJobs(): Promise<Job[]> {
    return prisma.job.findMany({
      where: {
        isActive: true,
        deadline: {
          gte: new Date(),
        },
      },
      orderBy: { postedAt: "desc" },
      include: {
        employer: {
          include: {
            user: true,
          },
        },
        applications: {
          select: {
            id: true,
            status: true,
          },
        },
        savedBy: {
          select: {
            userId: true,
          },
        },
      },
    });
  }

  async listJobsByEmployer(employerId: string): Promise<Job[]> {
    return prisma.job.findMany({
      where: { 
        employerId: employerId 
      },
      orderBy: { postedAt: "desc" },
      include: {
        employer: {
          include: {
            user: true,
          },
        },
        applications: true,
        savedBy: true,
      },
    });
  }

  async deleteJob(id: string): Promise<Job> {
    return prisma.job.delete({ 
      where: { id },
      include: {
        employer: true,
      },
    });
  }


  async updateJob(id: string, data: Partial<Job>): Promise<Job> {
    return prisma.job.update({
      where: { id },
      data: {
        ...data,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        salary: data.salary ? parseFloat(data.salary as any) : undefined,
        salaryMax: data.salaryMax ? parseFloat(data.salaryMax as any) : undefined,
      },
      include: {
        employer: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async getJobsByEmployerId(employerId: string): Promise<Job[]> {
    return prisma.job.findMany({
      where: { employerId },
      orderBy: { postedAt: "desc" },
      include: {
        employer: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}

export const jobService = new JobService();