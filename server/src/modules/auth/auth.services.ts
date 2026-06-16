import { inject, injectable } from "inversify";
import { TYPES } from "../../config/ioc.types.js";
import { IUnitOfService } from "../../services/interfaces/iunitOf.service.js";

@injectable()
export default class AuthServices {
  constructor(@inject(TYPES.IUnitOfWork) private unitOfWork: IUnitOfService) {}

  async login(email: string, password: string) {}
}
