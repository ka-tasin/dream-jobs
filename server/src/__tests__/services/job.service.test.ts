import { jobService } from "../../modules/job/job.service.js";
import prisma from "../../../prisma/index.js";

jest.mock("../../../prisma/index.js", () => ({
  __esModule: true,
  default: {
    job: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("JobService", () => {
  afterEach(() => jest.clearAllMocks());

  it("should create job via Prisma", async () => {
    const data = { title: "Fullstack Dev", createdBy: "user1", deadline: "2025-10-20" } as any;
    const job = { id: "1", ...data };
    (prisma.job.create as jest.Mock).mockResolvedValue(job);

    const result = await jobService.createJob(data);
    expect(prisma.job.create).toHaveBeenCalledWith({
      data: { ...data, deadline: new Date(data.deadline) },
    });
    expect(result).toEqual(job);
  });

  it("should get job by id via Prisma", async () => {
    const job = { id: "1" } as any;
    (prisma.job.findUnique as jest.Mock).mockResolvedValue(job);

    const result = await jobService.getJobById("1");
    expect(prisma.job.findUnique).toHaveBeenCalledWith({ where: { id: "1" } });
    expect(result).toEqual(job);
  });

  it("should list jobs via Prisma", async () => {
    const jobs = [{ id: "1" }];
    (prisma.job.findMany as jest.Mock).mockResolvedValue(jobs);

    const result = await jobService.listJobs();
    expect(prisma.job.findMany).toHaveBeenCalledWith({ orderBy: { postedAt: "desc" } });
    expect(result).toEqual(jobs);
  });

  it("should list jobs by creator via Prisma", async () => {
    const jobs = [{ id: "1", createdBy: "user1" }];
    (prisma.job.findMany as jest.Mock).mockResolvedValue(jobs);

    const result = await jobService.listJobsByCreator("user1");
    expect(prisma.job.findMany).toHaveBeenCalledWith({ where: { createdBy: "user1" } });
    expect(result).toEqual(jobs);
  });

  it("should delete job via Prisma", async () => {
    const job = { id: "1" };
    (prisma.job.delete as jest.Mock).mockResolvedValue(job);

    const result = await jobService.deleteJob("1");
    expect(prisma.job.delete).toHaveBeenCalledWith({ where: { id: "1" } });
    expect(result).toEqual(job);
  });
});
