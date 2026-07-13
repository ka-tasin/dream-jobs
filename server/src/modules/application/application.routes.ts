import { Router } from "express";
import { applicationController } from "./application.controller.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { Role } from "../../../prisma/generated/prisma/index.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import { validate, validateParams, validateQuery } from "../../middlewares/validation.middleware.js";
import {
  applyJobSchema,
  applicationQuerySchema,
  applicationParamsSchema,
  updateStatusSchema
} from "./application.validation.js";

const applicationRouter = Router();

applicationRouter.post(
  "/apply",
  authenticate,
  validate(applyJobSchema),
  (req, res, next) => applicationController.apply(req, res, next)
);

applicationRouter.get(
  "/my",
  authenticate,
  validateQuery(applicationQuerySchema), 
  (req, res, next) => applicationController.getUserApplications(req, res, next)
);

applicationRouter.get(
  "/",
  authenticate,
  authorize([Role.EMPLOYER, Role.ADMIN]),
  validateQuery(applicationQuerySchema),
  (req, res, next) => applicationController.getApplications(req, res, next)
);

applicationRouter.get(
  "/stats",
  authenticate,
  authorize([Role.EMPLOYER, Role.ADMIN]),
  (req, res, next) => applicationController.getApplicationStats(req, res, next)
);

applicationRouter.get(
  "/job/:jobId",
  authenticate,
  authorize([Role.EMPLOYER, Role.ADMIN]),
  validateParams(applicationParamsSchema), 
  validateQuery(applicationQuerySchema),
  (req, res, next) => applicationController.getApplicationsByJob(req, res, next)
);

applicationRouter.patch(
  "/:id/status",
  authenticate,
  authorize([Role.EMPLOYER, Role.ADMIN]),
  validate(updateStatusSchema),
  (req, res, next) => applicationController.updateApplicationStatus(req, res, next)
);

export default applicationRouter;