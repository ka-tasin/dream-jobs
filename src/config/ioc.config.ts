import { Container } from "inversify";
import { IUnitOfService } from "../services/interfaces/iunitOf.service";
import { TYPES } from "./ioc.types";
import UnitOfService from "../services/unitOf.services";
import AccountController from "../controllers/account.controller";
import { IUserService } from "../services/interfaces/iuser.service";
import UserService from "../services/user.service";
import IUnitOfWork from "../repositories/interfaces/iunitofwork.repository";
import UnitOfWork from "../repositories/unitOfWork.repository";
import { IUserRepository } from "../repositories/interfaces/iuser.repository";
import UserRepository from "../repositories/user.repository";
import AuthMiddleware from "../middlewares/authenticate.middleware";
import { IJobRepository } from "../repositories/interfaces/ijob.repository";
import JobRepository from "../repositories/job.repository";
import { IJobService } from "../services/interfaces/ijob.service";
import JobService from "../services/job.service";
import JobController from "../controllers/job.controller";
import RoleMiddleware from "../middlewares/role.middleware";
import UserController from "../controllers/user.controller";

const container = new Container();

container.bind<IUnitOfService>(TYPES.IUnitOfService).to(UnitOfService);
container
  .bind<AccountController>(TYPES.AccountController)
  .to(AccountController);
container.bind<IUserService>(TYPES.IUserService).to(UserService);
container.bind<IUnitOfWork>(TYPES.IUnitOfWork).to(UnitOfWork);
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container.bind<UserController>(TYPES.UserController).to(UserController);

container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);

container.bind<IJobRepository>(TYPES.IJobRepository).to(JobRepository);
container.bind<IJobService>(TYPES.IJobService).to(JobService);
container.bind<JobController>(TYPES.JobController).to(JobController);
container.bind<RoleMiddleware>(TYPES.RoleMiddleware).to(RoleMiddleware);

export default container;
