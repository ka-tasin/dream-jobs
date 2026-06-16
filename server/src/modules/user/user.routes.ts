import { Router } from "express";
import container from "../../config/ioc.config.js";
import UserController from "./user.controller.js";
import { TYPES } from "../../config/ioc.types.js";
import AuthMiddleware from "../../middlewares/authenticate.middleware.js";

const userRouter = Router();

const userController = container.get<UserController>(TYPES.UserController);
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);

userRouter.put(
  "/upgradeUser/:id",
  authMiddleware.authenticate.bind(authMiddleware),
  userController.updateUserRole.bind(userController)
);

export default userRouter;
