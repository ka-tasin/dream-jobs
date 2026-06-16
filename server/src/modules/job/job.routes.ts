import { Router } from "express";
import container from "../../config/ioc.config.js";
import JobController from "./job.controller.js";
import { TYPES } from "../../config/ioc.types.js";
import RoleMiddleware from "../../middlewares/role.middleware.js";
import { Role } from "../../../prisma/generated/prisma/index.js";
import AuthMiddleware from "../../middlewares/authenticate.middleware.js";

const jobRouter = Router();
const jobController = container.get<JobController>(TYPES.JobController);
const roleMiddleware = container.get<RoleMiddleware>(TYPES.RoleMiddleware);
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);

jobRouter.post(
  "/",
  authMiddleware.authenticate.bind(authMiddleware),
  roleMiddleware.authorize([Role.EMPLOYER, Role.ADMIN]),
  jobController.create.bind(jobController)
);

jobRouter.delete(
  "/:id",
  authMiddleware.authenticate.bind(authMiddleware),
  roleMiddleware.authorize([Role.EMPLOYER, Role.ADMIN]),
  jobController.delete.bind(jobController)
);

jobRouter.get("/", jobController.getAll.bind(jobController));

jobRouter.get(
  "/:id",
  authMiddleware.authenticate.bind(authMiddleware),
  jobController.getById.bind(jobController)
);

jobRouter.get(
  "/employer/:userId",
  jobController.getByCreator.bind(jobController)
);

export default jobRouter;
