import { Router } from "express";
import container from "../config/ioc.config";
import { TYPES } from "../config/ioc.types";
import ApplicationController from "../controllers/application.controller";
import RoleMiddleware from "../middlewares/role.middleware";
import { Role } from "../../prisma/generated/prisma";
import AuthMiddleware from "src/middlewares/authenticate.middleware";

const applicationRouter = Router();

const roleMiddleware = container.get<RoleMiddleware>(TYPES.RoleMiddleware);
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);
const applicationController = container.get<ApplicationController>(
  TYPES.ApplicationController
);

applicationRouter.post(
  "/apply",
  authMiddleware.authenticate.bind(authMiddleware),
  applicationController.apply.bind(applicationController)
);

applicationRouter.get(
  "/my",
  authMiddleware.authenticate.bind(authMiddleware),
  applicationController.getUserApplications.bind(applicationController)
);

applicationRouter.get(
  "/",
  roleMiddleware.authorize([Role.EMPLOYER, Role.ADMIN]),
  applicationController.getApplications.bind(applicationController)
);

applicationRouter.get(
  "/job/:jobId",
  roleMiddleware.authorize([Role.EMPLOYER, Role.ADMIN]),
  applicationController.getApplicationsByJob.bind(applicationController)
);

export default applicationRouter;
