import { Router } from "express";
import container from "../../config/ioc.config.js";
import AccountController from "./account.controller.js";
import { TYPES } from "../../config/ioc.types.js";

const accountRouter = Router();

const accountController = container.get<AccountController>(
  TYPES.AccountController
);

accountRouter.post(
  "/register",
  accountController.register.bind(accountController)
);
accountRouter.post("/login", accountController.login.bind(accountController));
accountRouter.post(
  "/verifyToken",
  accountController.verifyToken.bind(accountController)
);

export default accountRouter;
