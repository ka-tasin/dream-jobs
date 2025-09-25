"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const account_routes_1 = __importDefault(require("./account.routes"));
const job_routes_1 = __importDefault(require("./job.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const routes = (0, express_1.Router)();
routes.use("/auth", account_routes_1.default);
routes.use("/jobs", job_routes_1.default);
routes.use("/users", user_routes_1.default);
exports.default = routes;
