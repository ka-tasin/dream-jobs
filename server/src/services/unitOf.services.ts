import { inject, injectable } from "inversify";
import { TYPES } from "../config/ioc.types.js";
import { IUserService } from "../modules/user/interfaces/iuser.service.js";
import { IUnitOfService } from "./interfaces/iunitOf.service.js";
import { IApplicatoinService } from "../modules/application/interfaces/iapplication.service.js";
import { IJobService } from "../modules/job/interfaces/ijob.service.js";

@injectable()
export default class UnitOfService implements IUnitOfService {
  constructor(
    @inject(TYPES.IUserService) public User: IUserService,
    @inject(TYPES.IApplicationService) public Application: IApplicatoinService,
    @inject(TYPES.IJobService) public Job: IJobService
  ) {}
}
