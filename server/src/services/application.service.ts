import { inject, injectable } from "inversify";
import { TYPES } from "../config/ioc.types";
import IUnitOfWork from "../repositories/interfaces/iunitofwork.repository";
import { IApplicatoinService } from "./interfaces/iapplication.service";

@injectable()
export default class ApplicationService implements IApplicatoinService {
  constructor(@inject(TYPES.IUnitOfWork) private unitOfWork: IUnitOfWork) {}

  async getApplicationsForEmployer(employerId: string) {
    return this.unitOfWork.Application.getByEmployerId(employerId);
  }

  async getApplicationsForJob(jobId: string) {
    return this.unitOfWork.Application.getByJobId(jobId);
  }
}
