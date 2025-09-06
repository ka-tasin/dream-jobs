import container from "../config/ioc.config";
import { IUserController } from "./interfaces/iuser.controller";

class UserController implements IUserController {
  constructor(private unitOfService = container.bind<IUnitOfService>);
}
