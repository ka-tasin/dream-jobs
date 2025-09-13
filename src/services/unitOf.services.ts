import { inject, injectable } from "inversify";
import { TYPES } from "../config/ioc.types";
import { IUserService } from "./interfaces/iuser.service";

@injectable()
export default class UnitOfService {
  constructor(@inject(TYPES.IUserService) public User: IUserService) {}
}
