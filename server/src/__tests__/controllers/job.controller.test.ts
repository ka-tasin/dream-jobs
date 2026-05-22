import JobController from "../../modules/job/job.controller";
import { Role } from "../../../prisma/generated/prisma";

describe("JobController", () => {
  const mockJobService = {
    createJob: jest.fn(),
    listJobs: jest.fn(),
    getJobById: jest.fn(),
    listJobsByCreator: jest.fn(),
    deleteJob: jest.fn(),
  };
  const mockUnitOfService = { Job: mockJobService } as any;
  const controller = new JobController(mockUnitOfService);

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  afterEach(() => jest.clearAllMocks());

  it("should forbid non-employer/admin from creating jobs", async () => {
    const req: any = { user: { role: Role.USER } };
    const res = mockRes();

    await controller.create(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("should create a job for employer", async () => {
    const req: any = { user: { id: "u1", role: Role.EMPLOYER }, body: { title: "Dev" } };
    const res = mockRes();
    const job = { id: "1", title: "Dev" };
    mockJobService.createJob.mockResolvedValue(job);

    await controller.create(req, res);
    expect(mockJobService.createJob).toHaveBeenCalledWith({ title: "Dev", createdBy: "u1" });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: job });
  });

  it("should get all jobs", async () => {
    const req: any = {};
    const res = mockRes();
    const jobs = [{ id: "1" }];
    mockJobService.listJobs.mockResolvedValue(jobs);

    await controller.getAll(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: jobs });
  });

  it("should get job by id", async () => {
    const req: any = { params: { id: "1" } };
    const res = mockRes();
    const job = { id: "1" };
    mockJobService.getJobById.mockResolvedValue(job);

    await controller.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: job });
  });

  it("should handle not found job", async () => {
    const req: any = { params: { id: "999" } };
    const res = mockRes();
    mockJobService.getJobById.mockResolvedValue(null);

    await controller.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should delete job if user owns it", async () => {
    const req: any = { params: { id: "1" }, user: { id: "u1", role: Role.EMPLOYER } };
    const res = mockRes();
    const job = { id: "1", createdBy: "u1" };
    mockJobService.getJobById.mockResolvedValue(job);
    mockJobService.deleteJob.mockResolvedValue(job);

    await controller.delete(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "Job deleted" });
  });
});
