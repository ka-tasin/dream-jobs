import { inject, injectable } from "inversify";
import { TYPES } from "../config/ioc.types";
import { IUnitOfService } from "./interfaces/iunitOf.service";

@injectable()
export default class AuthServices {
  constructor(@inject(TYPES.IUnitOfWork) private unitOfWork: IUnitOfService) {}

  async login(email: string, password: string) {}
}
