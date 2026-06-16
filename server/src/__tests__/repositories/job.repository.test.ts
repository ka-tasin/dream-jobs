import prisma from "../../../prisma/index.js";
import JobRepository from "../../modules/job/job.repository.js";

jest.mock("../../../prisma/index.js", () => ({
  job: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("JobRepository", () => {
  const repo = new JobRepository();

  afterEach(() => jest.clearAllMocks());

  it("should create a job", async () => {
    const data = { title: "Developer", createdBy: "user1", deadline: "2025-10-20" } as any;
    const job = { id: "1", ...data };
    (prisma.job.create as jest.Mock).mockResolvedValue(job);

    const result = await repo.create(data);
    expect(prisma.job.create).toHaveBeenCalledWith({
      data: { ...data, deadline: new Date(data.deadline) },
    });
    expect(result).toEqual(job);
  });

  it("should find job by id", async () => {
    const job = { id: "1", title: "Backend Dev" } as any;
    (prisma.job.findUnique as jest.Mock).mockResolvedValue(job);

    const result = await repo.findById("1");
    expect(prisma.job.findUnique).toHaveBeenCalledWith({ where: { id: "1" } });
    expect(result).toEqual(job);
  });

  it("should get all jobs", async () => {
    const jobs = [{ id: "1" }, { id: "2" }];
    (prisma.job.findMany as jest.Mock).mockResolvedValue(jobs);

    const result = await repo.findAll();
    expect(prisma.job.findMany).toHaveBeenCalledWith({ orderBy: { postedAt: "desc" } });
    expect(result).toEqual(jobs);
  });

  it("should find jobs by creator", async () => {
    const jobs = [{ id: "1", createdBy: "user1" }];
    (prisma.job.findMany as jest.Mock).mockResolvedValue(jobs);

    const result = await repo.findByCreator("user1");
    expect(prisma.job.findMany).toHaveBeenCalledWith({ where: { createdBy: "user1" } });
    expect(result).toEqual(jobs);
  });

  it("should delete job", async () => {
    const job = { id: "1" };
    (prisma.job.delete as jest.Mock).mockResolvedValue(job);

    const result = await repo.delete("1");
    expect(prisma.job.delete).toHaveBeenCalledWith({ where: { id: "1" } });
    expect(result).toEqual(job);
  });
});
