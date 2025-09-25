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
let AuthMiddleware = class AuthMiddleware {
    unitOfService;
    constructor(unitOfService) {
        this.unitOfService = unitOfService;
    }
    authenticate(req, res, next) {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Unauthorized access" });
            return;
        }
        const payload = this.unitOfService.User.verifyToken(token);
        if (!payload) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        req.user = payload;
        next();
    }
};
AuthMiddleware = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(ioc_types_1.TYPES.IUnitOfService)),
    __metadata("design:paramtypes", [Object])
], AuthMiddleware);
exports.default = AuthMiddleware;
