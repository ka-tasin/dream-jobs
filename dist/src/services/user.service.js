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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const ioc_types_1 = require("../config/ioc.types");
const prisma_1 = require("../../prisma/generated/prisma");
const password_utils_1 = __importDefault(require("../utils/password.utils"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let UserService = class UserService {
    unitOfWork;
    constructor(unitOfWork) {
        this.unitOfWork = unitOfWork;
    }
    async create(data, role) {
        if (!data.password) {
            throw new Error("Password is required to create a user");
        }
        const hashedPassword = await password_utils_1.default.hashPassword(data.password);
        const user = await this.unitOfWork.transaction(async (transactionClient) => {
            return transactionClient.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password: hashedPassword,
                    role: role,
                    provider: data.provider ?? prisma_1.AuthProvider.CREDENTIALS,
                    providerId: data.providerId ?? null,
                },
                select: { id: true, name: true, email: true, role: true },
            });
        });
        if (!user)
            return {
                success: false,
                message: "No user added!",
            };
        return {
            success: true,
            data: user,
        };
    }
    async getUserByEmail(email) {
        const user = await this.unitOfWork.User.findByEmail(email);
        if (!user)
            return null;
        return user;
    }
    async login(email, password) {
        const user = await this.unitOfWork.User.findByEmail(email);
        if (!user || !user.password) {
            return null;
        }
        const isUserMatch = bcrypt_1.default.compare(password, user.password);
        if (!isUserMatch)
            return null;
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        const { password: _, ...userWithoutPassword } = user;
        return { token, user: userWithoutPassword };
    }
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        }
        catch (err) {
            return null;
        }
    }
    async updateUserRole(id) {
        const user = await this.unitOfWork.User.findById(id);
        if (!user)
            return null;
        const updatedUser = await this.unitOfWork.User.updateRole(id);
        if (!updatedUser)
            return null;
        return {
            id: updatedUser.id,
            email: updatedUser.email,
            role: updatedUser.role,
        };
    }
};
UserService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(ioc_types_1.TYPES.IUnitOfWork)),
    __metadata("design:paramtypes", [Object])
], UserService);
exports.default = UserService;
