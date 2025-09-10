import { Container } from "inversify";
import { IUnitOfService } from "../services/interfaces/iunitOf.service";
import { TYPES } from "./ioc.types";
import unitOfService from "../services/unitOf.services";

const container = new Container();

container.bind<IUnitOfService>(TYPES.IUnitOfService).to(unitOfService);

export default container;
