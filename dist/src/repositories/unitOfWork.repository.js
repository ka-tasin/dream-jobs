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
const prisma_1 = __importDefault(require("../../prisma"));
const ioc_types_1 = require("../config/ioc.types");
let UnitOfWork = class UnitOfWork {
    User;
    Job;
    Application;
    constructor(User, Job, Application) {
        this.User = User;
        this.Job = Job;
        this.Application = Application;
    }
    async transaction(callback) {
        return prisma_1.default.$transaction(async (transactionClient) => {
            return callback(transactionClient);
        });
    }
};
UnitOfWork = __decorate([
    __param(0, (0, inversify_1.inject)(ioc_types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(ioc_types_1.TYPES.IJobRepository)),
    __param(2, (0, inversify_1.inject)(ioc_types_1.TYPES.IApplicationRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], UnitOfWork);
exports.default = UnitOfWork;
