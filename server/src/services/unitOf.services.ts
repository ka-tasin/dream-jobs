import container from "../config/ioc.config";
import { IUserService } from "./interfaces/iuser.service";

export default class unitOfService {
  constructor(
    public User: IUserService = container.get<IUserService>(TYPES.IUserService)
  ) {}
}
