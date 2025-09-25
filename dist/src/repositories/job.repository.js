"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const prisma_1 = __importDefault(require("../../prisma"));
let JobRepository = class JobRepository {
    async create(data) {
        return prisma_1.default.job.create({ data });
    }
    async findById(id) {
        return prisma_1.default.job.findUnique({ where: { id } });
    }
    async findAll() {
        return prisma_1.default.job.findMany({
            orderBy: { postedAt: "desc" },
        });
    }
    async findByCreator(userId) {
        return prisma_1.default.job.findMany({ where: { createdBy: userId } });
    }
    async delete(id) {
        return prisma_1.default.job.delete({ where: { id } });
    }
};
JobRepository = __decorate([
    (0, inversify_1.injectable)()
], JobRepository);
exports.default = JobRepository;
