import { Prisma } from "../../../prisma/generated/prisma/index.js";
import { IApplicationRepository } from "../../modules/application/interfaces/iapplication.repository.js";
import { IJobRepository } from "../../modules/job/interfaces/ijob.repository.js";
import { IUserRepository } from "../../modules/user/interfaces/iuser.repository.js";

export default interface IUnitOfWork {
  User: IUserRepository;
  Application: IApplicationRepository;
  Job: IJobRepository;

  transaction<T>(
    callback: (prisma: Prisma.TransactionClient) => Promise<T>
  ): Promise<T>;
}
