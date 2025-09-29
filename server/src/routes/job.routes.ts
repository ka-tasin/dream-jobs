import { Router } from "express";
import container from "../config/ioc.config";
import JobController from "../controllers/job.controller";
import { TYPES } from "../config/ioc.types";
import RoleMiddleware from "../middlewares/role.middleware";
import { Role } from "../../prisma/generated/prisma";
import AuthMiddleware from "../middlewares/authenticate.middleware";

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
