import { Router } from "express";
import { accountController } from "./auth.controller.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { createUserSchema, loginSchema } from "../user/user.validation.js";

const accountRouter = Router();

accountRouter.post(
  "/register",
  validate(createUserSchema),
  (req, res, next) => accountController.register(req, res, next)
);

accountRouter.post(
  "/login",
  validate(loginSchema),
  (req, res, next) => accountController.login(req, res, next)
);

accountRouter.post(
  "/logout",
  (req, res, next) => accountController.logout(req, res, next)
);

accountRouter.post(
  "/verifyToken",
  (req, res, next) => accountController.verifyToken(req, res, next)
);

export default accountRouter;
