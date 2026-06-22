import { Router } from "express";
import { accountController } from "./account.controller.js";
import { validateBody } from "../../middlewares/validation.middleware.js";
import { createUserSchema, loginSchema } from "../user/user.validation.js";

const accountRouter = Router();

accountRouter.post(
  "/register",
  validateBody(createUserSchema),
  (req, res, next) => accountController.register(req, res, next)
);

accountRouter.post(
  "/login",
  validateBody(loginSchema),
  (req, res, next) => accountController.login(req, res, next)
);

accountRouter.post(
  "/verifyToken",
  (req, res, next) => accountController.verifyToken(req, res, next)
);

export default accountRouter;
