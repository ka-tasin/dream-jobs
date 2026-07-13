import { Router } from "express";
import { adminController } from "./admin.controller.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { Role } from "../../../prisma/generated/prisma/index.js";

const adminRouter = Router();

adminRouter.get(
  "/",
  authenticate,
  authorize([Role.ADMIN]),
  (req, res, next) => adminController.getAllUsers(req, res, next)
);

adminRouter.get(
  "/stats",
  authenticate,
  authorize([Role.ADMIN]),
  (req, res, next) => adminController.getPlatformStats(req, res, next)
);

adminRouter.delete(
  "/:id",
  authenticate,
  authorize([Role.ADMIN]),
  (req, res, next) => adminController.deleteUser(req, res, next)
);

export default adminRouter;
