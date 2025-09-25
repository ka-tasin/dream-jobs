"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma"));
const prisma_2 = require("../../prisma/generated/prisma");
class UserRepository {
    async create(data) {
        return prisma_1.default.user.create({
            data,
        });
    }
    async findByEmail(email) {
        return prisma_1.default.user.findUnique({
            where: { email },
            select: { id: true, email: true, name: true, password: true },
        });
    }
    async findById(id) {
        return prisma_1.default.user.findUnique({
            where: { id },
            select: { id: true, email: true, name: true, role: true },
        });
    }
    async updateRole(id) {
        return prisma_1.default.user.update({
            where: { id },
            data: { role: prisma_2.Role.EMPLOYER },
            select: { id: true, name: true, email: true, role: true },
        });
    }
}
exports.default = UserRepository;
