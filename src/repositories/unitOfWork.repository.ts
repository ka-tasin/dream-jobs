import { inject } from "inversify";
import prisma from "../../prisma";
import { Prisma } from "../../prisma/generated/prisma";
import { TYPES } from "../config/ioc.types";
import IUnitOfWork from "./interfaces/iunitofwork.repository";
import { IUserRepository } from "./interfaces/iuser.repository";

export default class UnitOfWork implements IUnitOfWork {
  constructor(@inject(TYPES.IUserRepository) public User: IUserRepository) {}

  async transaction<T>(
    callback: (prisma: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    return prisma.$transaction(async (transactionClient) => {
      return callback(transactionClient);
    });
  }
}
