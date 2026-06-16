import { Router } from "express";
import container from "../../config/ioc.config.js";
import { TYPES } from "../../config/ioc.types.js";
import ApplicationController from "./application.controller.js";
import RoleMiddleware from "../../middlewares/role.middleware.js";
import { Role } from "../../../prisma/generated/prisma/index.js";
import AuthMiddleware from "../../middlewares/authenticate.middleware.js";

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
