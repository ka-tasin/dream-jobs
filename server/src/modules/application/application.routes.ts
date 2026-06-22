import { Router } from "express";
import { applicationController } from "./application.controller.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { Role } from "../../../prisma/generated/prisma/index.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";

const applicationRouter = Router();

applicationRouter.post(
  "/apply",
  authenticate,
  (req, res, next) => applicationController.apply(req, res, next)
);

applicationRouter.get(
  "/my",
  authenticate,
  (req, res, next) => applicationController.getUserApplications(req, res, next)
);

applicationRouter.get(
  "/",
  authenticate,
  authorize([Role.EMPLOYER, Role.ADMIN]),
  (req, res, next) => applicationController.getApplications(req, res, next)
);

applicationRouter.get(
  "/job/:jobId",
  authenticate,
  authorize([Role.EMPLOYER, Role.ADMIN]),
  (req, res, next) => applicationController.getApplicationsByJob(req, res, next)
);

export default applicationRouter;
