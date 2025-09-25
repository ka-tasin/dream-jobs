"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ioc_config_1 = __importDefault(require("../config/ioc.config"));
const ioc_types_1 = require("../config/ioc.types");
const accountRouter = (0, express_1.Router)();
const accountController = ioc_config_1.default.get(ioc_types_1.TYPES.AccountController);
accountRouter.post("/register", accountController.register.bind(accountController));
accountRouter.post("/login", accountController.login.bind(accountController));
accountRouter.post("/verifyToken", accountController.verifyToken.bind(accountController));
exports.default = accountRouter;
