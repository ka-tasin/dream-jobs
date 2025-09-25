"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ioc_config_1 = __importDefault(require("../config/ioc.config"));
const ioc_types_1 = require("../config/ioc.types");
const prisma_1 = require("../../prisma/generated/prisma");
const jobRouter = (0, express_1.Router)();
const jobController = ioc_config_1.default.get(ioc_types_1.TYPES.JobController);
const roleMiddleware = ioc_config_1.default.get(ioc_types_1.TYPES.RoleMiddleware);
const authMiddleware = ioc_config_1.default.get(ioc_types_1.TYPES.AuthMiddleware);
jobRouter.post("/", authMiddleware.authenticate.bind(authMiddleware), roleMiddleware.authorize([prisma_1.Role.EMPLOYER, prisma_1.Role.ADMIN]), jobController.create.bind(jobController));
jobRouter.delete("/:id", authMiddleware.authenticate.bind(authMiddleware), roleMiddleware.authorize([prisma_1.Role.EMPLOYER, prisma_1.Role.ADMIN]), jobController.delete.bind(jobController));
jobRouter.get("/", jobController.getAll.bind(jobController));
jobRouter.get("/:id", authMiddleware.authenticate.bind(authMiddleware), jobController.getById.bind(jobController));
jobRouter.get("/employer/:userId", jobController.getByCreator.bind(jobController));
exports.default = jobRouter;
