import { Container } from "inversify";
import { IUnitOfService } from "../services/interfaces/iunitOf.service";
import { TYPES } from "./ioc.types";
import UnitOfService from "../services/unitOf.services";
import AccountController from "../modules/account/account.controller";
import { IUserService } from "../modules/user/interfaces/iuser.service";
import UserService from "../modules/user/user.service";
import IUnitOfWork from "../repositories/interfaces/iunitofwork.repository";
import UnitOfWork from "../repositories/unitOfWork.repository";
import { IUserRepository } from "../modules/user/interfaces/iuser.repository";
import UserRepository from "../modules/user/user.repository";
import AuthMiddleware from "../middlewares/authenticate.middleware";
import { IJobRepository } from "../modules/job/interfaces/ijob.repository";
import JobRepository from "../modules/job/job.repository";
import { IJobService } from "../modules/job/interfaces/ijob.service";
import JobService from "../modules/job/job.service";
import JobController from "../modules/job/job.controller";
import RoleMiddleware from "../middlewares/role.middleware";
import UserController from "../modules/user/user.controller";
import { IApplicationRepository } from "../modules/application/interfaces/iapplication.repository";
import ApplicationRepository from "../modules/application/application.repository";
import { IApplicatoinService } from "../modules/application/interfaces/iapplication.service";
import ApplicationService from "../modules/application/application.service";
import ApplicationController from "../modules/application/application.controller";

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
