import { Router } from "express";
import { userController } from "./user.controller.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";

const userRouter = Router();

userRouter.put(
  "/upgradeUser/:id",
  authenticate,
  (req, res, next) => userController.updateUserRole(req, res, next)
);

export default userRouter;
