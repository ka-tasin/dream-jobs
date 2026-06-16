import { Container } from "inversify";
import { IUnitOfService } from "../services/interfaces/iunitOf.service.js";
import { TYPES } from "./ioc.types.js";
import UnitOfService from "../services/unitOf.services.js";
import AccountController from "../modules/account/account.controller.js";
import { IUserService } from "../modules/user/interfaces/iuser.service.js";
import UserService from "../modules/user/user.service.js";
import IUnitOfWork from "../repositories/interfaces/iunitofwork.repository.js";
import UnitOfWork from "../repositories/unitOfWork.repository.js";
import { IUserRepository } from "../modules/user/interfaces/iuser.repository.js";
import UserRepository from "../modules/user/user.repository.js";
import AuthMiddleware from "../middlewares/authenticate.middleware.js";
import { IJobRepository } from "../modules/job/interfaces/ijob.repository.js";
import JobRepository from "../modules/job/job.repository.js";
import { IJobService } from "../modules/job/interfaces/ijob.service.js";
import JobService from "../modules/job/job.service.js";
import JobController from "../modules/job/job.controller.js";
import RoleMiddleware from "../middlewares/role.middleware.js";
import UserController from "../modules/user/user.controller.js";
import { IApplicationRepository } from "../modules/application/interfaces/iapplication.repository.js";
import ApplicationRepository from "../modules/application/application.repository.js";
import { IApplicatoinService } from "../modules/application/interfaces/iapplication.service.js";
import ApplicationService from "../modules/application/application.service.js";
import ApplicationController from "../modules/application/application.controller.js";

const container = new Container();

container.bind<IUnitOfService>(TYPES.IUnitOfService).to(UnitOfService);
container
  .bind<AccountController>(TYPES.AccountController)
  .to(AccountController);
container.bind<IUserService>(TYPES.IUserService).to(UserService);
container.bind<IUnitOfWork>(TYPES.IUnitOfWork).to(UnitOfWork);
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container.bind<UserController>(TYPES.UserController).to(UserController);

container
  .bind<IApplicationRepository>(TYPES.IApplicationRepository)
  .to(ApplicationRepository);
container
  .bind<IApplicatoinService>(TYPES.IApplicationService)
  .to(ApplicationService);
container
  .bind<ApplicationController>(TYPES.ApplicationController)
  .to(ApplicationController);

container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);

container.bind<IJobRepository>(TYPES.IJobRepository).to(JobRepository);
container.bind<IJobService>(TYPES.IJobService).to(JobService);
container.bind<JobController>(TYPES.JobController).to(JobController);
container.bind<RoleMiddleware>(TYPES.RoleMiddleware).to(RoleMiddleware);

export default container;
