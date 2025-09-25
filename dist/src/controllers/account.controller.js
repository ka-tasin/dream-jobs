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
let AccountController = class AccountController {
    unitOfService;
    constructor(unitOfService) {
        this.unitOfService = unitOfService;
    }
    async register(req, res) {
        const data = req.body;
        const user = await this.unitOfService.User.getUserByEmail(data.email);
        if (user)
            return res.status(409).json({ message: "User Already exists!" });
        const newUser = await this.unitOfService.User.create(data, prisma_1.Role.USER);
        if (!newUser)
            return res.status(400).json({ message: "Failed to create user!" });
        return res.status(200).json({
            success: true,
            message: "User created!",
            data: newUser,
        });
    }
    async login(req, res) {
        const { email, password } = req.body;
        const user = await this.unitOfService.User.login(email, password);
        if (!user)
            return res.status(401).json({ message: "Invalid email or password!" });
        const response = {
            success: true,
            message: "Login successfull!",
            data: user,
        };
        return res.status(200).json({
            success: true,
            message: "Login successful!",
            data: user,
        });
    }
    async verifyToken(req, res) {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token)
            return res.status(401).json({ message: "Token missing!" });
        const payload = this.unitOfService.User.verifyToken(token);
        if (!payload)
            res.status(401).json({ message: "Invalid token!" });
        return res
            .status(200)
            .json({ success: true, message: "Token valid", data: payload });
    }
};
AccountController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(ioc_types_1.TYPES.IUnitOfService)),
    __metadata("design:paramtypes", [Object])
], AccountController);
exports.default = AccountController;
