import { inject, injectable } from "inversify";
import { TYPES } from "../config/ioc.types";
import { IUserService } from "./interfaces/iuser.service";
import { IUnitOfService } from "./interfaces/iunitOf.service";
import { IApplicatoinService } from "./interfaces/iapplication.service";
import { IJobService } from "./interfaces/ijob.service";

@injectable()
export default class UnitOfService implements IUnitOfService {
  constructor(
    @inject(TYPES.IUserService) public User: IUserService,
    @inject(TYPES.IApplicationService) public Application: IApplicatoinService,
    @inject(TYPES.IJobService) public Job: IJobService
  ) {}
}
