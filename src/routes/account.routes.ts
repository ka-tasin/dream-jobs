import { Router } from "express";
import container from "../config/ioc.config";
import AccountController from "../controllers/account.controller";
import { TYPES } from "../config/ioc.types";

const accountRouter = Router();

const accountController = container.get<AccountController>(
  TYPES.AccountController
);

accountRouter.post("/register", accountController.register);

export default accountRouter;
