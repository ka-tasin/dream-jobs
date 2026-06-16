import JobService from "../../modules/job/job.service.js";
import IUnitOfWork from "../../repositories/interfaces/iunitofwork.repository.js";

describe("JobService", () => {
  const mockJobRepo = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    findByCreator: jest.fn(),
    delete: jest.fn(),
  };

  const mockUoW = { Job: mockJobRepo } as unknown as IUnitOfWork;
  const service = new JobService(mockUoW);

  afterEach(() => jest.clearAllMocks());

  it("should create job via repository", async () => {
    const job = { id: "1", title: "Fullstack Dev" } as any;
    mockJobRepo.create.mockResolvedValue(job);

    const result = await service.createJob(job);
    expect(mockJobRepo.create).toHaveBeenCalledWith(job);
    expect(result).toEqual(job);
  });

  it("should get job by id", async () => {
    const job = { id: "1" } as any;
    mockJobRepo.findById.mockResolvedValue(job);

    const result = await service.getJobById("1");
    expect(mockJobRepo.findById).toHaveBeenCalledWith("1");
    expect(result).toEqual(job);
  });

  it("should list jobs", async () => {
    const jobs = [{ id: "1" }];
    mockJobRepo.findAll.mockResolvedValue(jobs);

    const result = await service.listJobs();
    expect(mockJobRepo.findAll).toHaveBeenCalled();
    expect(result).toEqual(jobs);
  });

  it("should list jobs by creator", async () => {
    const jobs = [{ id: "1", createdBy: "user1" }];
    mockJobRepo.findByCreator.mockResolvedValue(jobs);

    const result = await service.listJobsByCreator("user1");
    expect(mockJobRepo.findByCreator).toHaveBeenCalledWith("user1");
    expect(result).toEqual(jobs);
  });

  it("should delete job", async () => {
    const job = { id: "1" };
    mockJobRepo.delete.mockResolvedValue(job);

    const result = await service.deleteJob("1");
    expect(mockJobRepo.delete).toHaveBeenCalledWith("1");
    expect(result).toEqual(job);
  });
});
