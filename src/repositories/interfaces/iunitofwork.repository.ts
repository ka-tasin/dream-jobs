import { Prisma } from "../../../prisma/generated/prisma";
import { IUserRepository } from "./iuser.repository";

export default interface IUnitOfWork {
  User: IUserRepository;

  transaction<T>(
    callback: (prisma: Prisma.TransactionClient) => Promise<T>
  ): Promise<T>;
}
