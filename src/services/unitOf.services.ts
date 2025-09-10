import container from "../config/ioc.config";
import { TYPES } from "../config/ioc.types";
import { IUserService } from "./interfaces/iuser.service";

export default class unitOfService {
  constructor(
    public User: IUserService = container.get<IUserService>(TYPES.IUserService)
  ) {}
}
