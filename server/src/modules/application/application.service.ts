import prisma from "../../../prisma/index.js";
import { Application } from "../../../prisma/generated/prisma/index.js";

export class ApplicationService {
  async getApplicationsForEmployer(employerId: string): Promise<Application[]> {
    const employer = await prisma.employer.findUnique({
      where: { userId: employerId },
      select: { id: true }
    });

    if (!employer) {
      throw new Error("Employer not found");
    }

    return prisma.application.findMany({
      where: {
        job: {
          employerId: employer.id,
        },
      },
      include: {
        user: true,
        job: {
          include: {
            employer: true
          }
        },
      },
      orderBy: { appliedAt: "desc" },
    });
  }

  async getApplicationsForJob(jobId: string): Promise<Application[]> {
    return prisma.application.findMany({
      where: { jobId },
      include: { 
        user: true,
        job: {
          include: {
            employer: true
          }
        }
      },
      orderBy: { appliedAt: "desc" },
    });
  }

  async applyToJob(
    userId: string,
    jobId: string,
    resumeUrl?: string,
    coverLetter?: string,
    phoneNumber?: string,
    linkedinUrl?: string,
    portfolioUrl?: string,
    yearsOfExp?: number
  ): Promise<Application> {
    // Check if job exists and is active
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { isActive: true }
    });

    if (!job) {
      throw new Error("Job not found");
    }

    if (!job.isActive) {
      throw new Error("This job is no longer accepting applications");
    }

    // Check for existing application
    const existing = await prisma.application.findFirst({
      where: { userId, jobId },
    });

    if (existing) {
      throw new Error("You have already applied to this job.");
    }

    // Create the application with ALL fields
    return prisma.application.create({
      data: {
        userId,
        jobId,
        resumeUrl,
        coverLetter,
        phoneNumber: phoneNumber || null,      
        linkedinUrl: linkedinUrl || null,      
        portfolioUrl: portfolioUrl || null,    
        yearsOfExp: yearsOfExp || null,        
      },
      include: {
        user: true,
        job: {
          include: {
            employer: true
          }
        }
      }
    });
  }

  async getUserApplications(userId: string, filters?: {
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<Application[]> {
    const { status, page = 1, limit = 10, sortBy = "appliedAt", sortOrder = "desc" } = filters || {};
    
    const skip = (page - 1) * limit;

    return prisma.application.findMany({
      where: {
        userId,
        ...(status && { status: status as any }),
      },
      include: {
        job: {
          include: {
            employer: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: limit,
    });
  }

  async getJobApplications(jobId: string, filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<Application[]> {
    const { status, page = 1, limit = 10 } = filters || {};
    const skip = (page - 1) * limit;

    return prisma.application.findMany({
      where: {
        jobId,
        ...(status && { status: status as any }),
      },
      include: {
        user: true,
      },
      orderBy: { appliedAt: "desc" },
      skip,
      take: limit,
    });
  }

  async getApplicationById(applicationId: string): Promise<Application | null> {
    return prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        user: true,
        job: {
          include: {
            employer: true
          }
        }
      }
    });
  }

  async updateApplicationStatus(
    applicationId: string, 
    status: string, 
    reviewNote?: string
  ): Promise<Application> {
    return prisma.application.update({
      where: { id: applicationId },
      data: {
        status: status as any,
        reviewNote,
        reviewedAt: new Date(),
      },
      include: {
        user: true,
        job: true
      }
    });
  }

  async getApplicationStats(employerId: string): Promise<{
    total: number;
    pending: number;
    reviewed: number;
    accepted: number;
    rejected: number;
  }> {
    const employer = await prisma.employer.findUnique({
      where: { userId: employerId },
      select: { id: true }
    });

    if (!employer) {
      throw new Error("Employer not found");
    }

    const applications = await prisma.application.findMany({
      where: {
        job: {
          employerId: employer.id
        }
      },
      select: {
        status: true
      }
    });

    const stats = {
      total: applications.length,
      pending: applications.filter(a => a.status === 'PENDING').length,
      reviewed: applications.filter(a => a.status === 'REVIEWED').length,
      accepted: applications.filter(a => a.status === 'ACCEPTED').length,
      rejected: applications.filter(a => a.status === 'REJECTED').length,
    };

    return stats;
  }
}

export const applicationService = new ApplicationService();