import { Router } from "express";
import container from "../config/ioc.config";
import AccountController from "../controllers/account.controller";
import { TYPES } from "../config/ioc.types";

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
