import { Router } from "express";
import container from "../config/ioc.config";
import UserController from "../controllers/user.controller";
import { TYPES } from "../config/ioc.types";
import AuthMiddleware from "../middlewares/authenticate.middleware";

const userRouter = Router();

const userController = container.get<UserController>(TYPES.UserController);
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);

userRouter.put(
  "/upgradeUser/:id",
  authMiddleware.authenticate.bind(authMiddleware),
  userController.updateUserRole.bind(userController)
);

export default userRouter;
