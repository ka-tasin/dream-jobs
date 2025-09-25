import { Router } from "express";
import container from "../config/ioc.config";
import { TYPES } from "../config/ioc.types";
import ApplicationController from "../controllers/application.controller";
import RoleMiddleware from "../middlewares/role.middleware";
import { Role } from "../../prisma/generated/prisma";

const router = Router();
const appController = container.get<ApplicationController>(
  TYPES.ApplicationController
);
const roleMiddleware = container.get<RoleMiddleware>(TYPES.RoleMiddleware);

router.get(
  "/",
  roleMiddleware.authorize([Role.EMPLOYER, Role.ADMIN]),
  appController.getApplications.bind(appController)
);

router.get(
  "/job/:jobId",
  roleMiddleware.authorize([Role.EMPLOYER, Role.ADMIN]),
  appController.getApplicationsByJob.bind(appController)
);

export default router;
