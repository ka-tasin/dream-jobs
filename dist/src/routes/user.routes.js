"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ioc_config_1 = __importDefault(require("../config/ioc.config"));
const ioc_types_1 = require("../config/ioc.types");
const userRouter = (0, express_1.Router)();
const userController = ioc_config_1.default.get(ioc_types_1.TYPES.UserController);
const authMiddleware = ioc_config_1.default.get(ioc_types_1.TYPES.AuthMiddleware);
userRouter.put("/upgradeUser/:id", authMiddleware.authenticate.bind(authMiddleware), userController.updateUserRole.bind(userController));
exports.default = userRouter;
