import { IApplicatoinService } from "./iapplication.service";
import { IJobService } from "./ijob.service";
import { IUserService } from "./iuser.service";

export interface IUnitOfService {
  User: IUserService;
  Application: IApplicatoinService;
  Job: IJobService;
}
