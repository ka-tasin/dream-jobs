"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const ioc_types_1 = require("./ioc.types");
const unitOf_services_1 = __importDefault(require("../services/unitOf.services"));
const account_controller_1 = __importDefault(require("../controllers/account.controller"));
const user_service_1 = __importDefault(require("../services/user.service"));
const unitOfWork_repository_1 = __importDefault(require("../repositories/unitOfWork.repository"));
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const authenticate_middleware_1 = __importDefault(require("../middlewares/authenticate.middleware"));
const job_repository_1 = __importDefault(require("../repositories/job.repository"));
const job_service_1 = __importDefault(require("../services/job.service"));
const job_controller_1 = __importDefault(require("../controllers/job.controller"));
const role_middleware_1 = __importDefault(require("../middlewares/role.middleware"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const application_repository_1 = __importDefault(require("../repositories/application.repository"));
const application_service_1 = __importDefault(require("../services/application.service"));
const application_controller_1 = __importDefault(require("../controllers/application.controller"));
const container = new inversify_1.Container();
container.bind(ioc_types_1.TYPES.IUnitOfService).to(unitOf_services_1.default);
container
    .bind(ioc_types_1.TYPES.AccountController)
    .to(account_controller_1.default);
container.bind(ioc_types_1.TYPES.IUserService).to(user_service_1.default);
container.bind(ioc_types_1.TYPES.IUnitOfWork).to(unitOfWork_repository_1.default);
container.bind(ioc_types_1.TYPES.IUserRepository).to(user_repository_1.default);
container.bind(ioc_types_1.TYPES.UserController).to(user_controller_1.default);
container
    .bind(ioc_types_1.TYPES.IApplicationRepository)
    .to(application_repository_1.default);
container
    .bind(ioc_types_1.TYPES.IApplicationService)
    .to(application_service_1.default);
container
    .bind(ioc_types_1.TYPES.AccountController)
    .to(application_controller_1.default);
container.bind(ioc_types_1.TYPES.AuthMiddleware).to(authenticate_middleware_1.default);
container.bind(ioc_types_1.TYPES.IJobRepository).to(job_repository_1.default);
container.bind(ioc_types_1.TYPES.IJobService).to(job_service_1.default);
container.bind(ioc_types_1.TYPES.JobController).to(job_controller_1.default);
container.bind(ioc_types_1.TYPES.RoleMiddleware).to(role_middleware_1.default);
exports.default = container;
