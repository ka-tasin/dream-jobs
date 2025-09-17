import { Router } from "express";
import container from "../config/ioc.config";
import { TYPES } from "../config/ioc.types";
import ApplicationController from "../controllers/application.controller";
import RoleMiddleware from "../middlewares/role.middleware";
import { Role } from "../../prisma/generated/prisma";
import AuthMiddleware from "../middlewares/authenticate.middleware";

const router = Router();
const applicationController = container.get<ApplicationController>(
  TYPES.ApplicationController
);
const roleMiddleware = container.get<RoleMiddleware>(TYPES.RoleMiddleware);
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);

router.get(
  "/",
  roleMiddleware.authorize([Role.EMPLOYER, Role.ADMIN]),
  applicationController.getApplications.bind(applicationController)
);

router.get(
  "/job/:jobId",
  roleMiddleware.authorize([Role.EMPLOYER, Role.ADMIN]),
  applicationController.getApplicationsByJob.bind(applicationController)
);

router.get(
  "/my/:id",
  authMiddleware.authenticate.bind(authMiddleware),
  applicationController.getUserApplications.bind(applicationController)
);

router.post(
  "/",
  authMiddleware.authenticate.bind(authMiddleware),
  applicationController.applyForJob.bind(applicationController)
);

export default router;
