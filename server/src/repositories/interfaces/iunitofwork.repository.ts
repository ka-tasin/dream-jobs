import { Prisma } from "../../../prisma/generated/prisma";
import { IApplicationRepository } from "./iapplication.repository";
import { IJobRepository } from "./ijob.repository";
import { IUserRepository } from "./iuser.repository";

export default interface IUnitOfWork {
  User: IUserRepository;
  Application: IApplicationRepository;
  Job: IJobRepository;

  transaction<T>(
    callback: (prisma: Prisma.TransactionClient) => Promise<T>
  ): Promise<T>;
}
