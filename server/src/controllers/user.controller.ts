import container from "../config/ioc.config";
import { IUnitOfService } from "../services/interfaces/iunitOf.service";
import { IUserController } from "./interfaces/iuser.controller";

export default class UserController implements IUserController {
  constructor(
    private unitOfService = container.get<IUnitOfService>(TYPES.IUserService)
  ) {}
}
