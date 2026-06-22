import { jobController } from "../../modules/job/job.controller.js";
import { jobService } from "../../modules/job/job.service.js";
import { Role } from "../../../prisma/generated/prisma/index.js";

jest.mock("../../modules/job/job.service.js", () => ({
  jobService: {
    createJob: jest.fn(),
    listJobs: jest.fn(),
    getJobById: jest.fn(),
    listJobsByCreator: jest.fn(),
    deleteJob: jest.fn(),
  },
}));

describe("JobController", () => {
  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a job for employer", async () => {
    const req: any = { user: { id: "u1", role: Role.EMPLOYER }, body: { title: "Dev" } };
    const res = mockRes();
    const job = { id: "1", title: "Dev" };
    (jobService.createJob as jest.Mock).mockResolvedValue(job);

    await jobController.create(req, res, mockNext);
    expect(jobService.createJob).toHaveBeenCalledWith({ title: "Dev", createdBy: "u1" });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: job });
  });

  it("should get all jobs", async () => {
    const req: any = {};
    const res = mockRes();
    const jobs = [{ id: "1" }];
    (jobService.listJobs as jest.Mock).mockResolvedValue(jobs);

    await jobController.getAll(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: jobs });
  });

  it("should get job by id", async () => {
    const req: any = { params: { id: "1" } };
    const res = mockRes();
    const job = { id: "1" };
    (jobService.getJobById as jest.Mock).mockResolvedValue(job);

    await jobController.getById(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: job });
  });

  it("should handle not found job", async () => {
    const req: any = { params: { id: "999" } };
    const res = mockRes();
    (jobService.getJobById as jest.Mock).mockResolvedValue(null);

    await jobController.getById(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should delete job if user owns it", async () => {
    const req: any = { params: { id: "1" }, user: { id: "u1", role: Role.EMPLOYER } };
    const res = mockRes();
    const job = { id: "1", createdBy: "u1" };
    (jobService.getJobById as jest.Mock).mockResolvedValue(job);
    (jobService.deleteJob as jest.Mock).mockResolvedValue(job);

    await jobController.delete(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "Job deleted" });
  });
});
