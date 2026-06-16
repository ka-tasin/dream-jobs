import { IApplicatoinService } from "../../modules/application/interfaces/iapplication.service.js";
import { IJobService } from "../../modules/job/interfaces/ijob.service.js";
import { IUserService } from "../../modules/user/interfaces/iuser.service.js";

export interface IUnitOfService {
  User: IUserService;
  Application: IApplicatoinService;
  Job: IJobService;
}
