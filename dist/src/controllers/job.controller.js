"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const ioc_types_1 = require("../config/ioc.types");
const prisma_1 = require("../../prisma/generated/prisma");
let JobController = class JobController {
    unitOfService;
    constructor(unitOfService) {
        this.unitOfService = unitOfService;
    }
    async create(req, res) {
        const user = req.user; // payload from JWT
        if (![prisma_1.Role.EMPLOYER, prisma_1.Role.ADMIN].includes(user.role)) {
            return res
                .status(403)
                .json({ message: "Forbidden: only employer or admin can create jobs" });
        }
        const data = { ...req.body, createdBy: user.id }; // auto-assign creator
        const job = await this.unitOfService.Job.createJob(data);
        return res.status(201).json({ success: true, data: job });
    }
    async getAll(req, res) {
        const jobs = await this.unitOfService.Job.listJobs();
        return res.status(200).json({ success: true, data: jobs });
    }
    async getById(req, res) {
        const { id } = req.params;
        const job = await this.unitOfService.Job.getJobById(id);
        if (!job)
            return res.status(404).json({ message: "Job not found" });
        return res.status(200).json({ success: true, data: job });
    }
    async getByCreator(req, res) {
        const { userId } = req.params;
        const jobs = await this.unitOfService.Job.listJobsByCreator(userId);
        return res.status(200).json({ success: true, data: jobs });
    }
    async delete(req, res) {
        const user = req.user;
        const { id } = req.params;
        const job = await this.unitOfService.Job.getJobById(id);
        if (!job)
            return res.status(404).json({ message: "Job not found" });
        if (user.role === prisma_1.Role.EMPLOYER && job.createdBy !== user.id) {
            return res
                .status(403)
                .json({ message: "Forbidden: cannot delete other employer's job" });
        }
        await this.unitOfService.Job.deleteJob(id);
        return res.status(200).json({ success: true, message: "Job deleted" });
    }
};
JobController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(ioc_types_1.TYPES.IUnitOfService)),
    __metadata("design:paramtypes", [Object])
], JobController);
exports.default = JobController;
