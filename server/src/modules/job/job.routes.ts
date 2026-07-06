import { Router } from "express";
import { jobController } from "./job.controller.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { Role } from "../../../prisma/generated/prisma/index.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { createJobSchema } from "./job.validation.js";

const jobRouter = Router();

jobRouter.post(
  "/",
  authenticate,
  authorize([Role.EMPLOYER, Role.ADMIN]),
  validate(createJobSchema),
  (req, res, next) => jobController.create(req, res, next)
);

jobRouter.delete(
  "/:id",
  authenticate,
  authorize([Role.EMPLOYER, Role.ADMIN]),
  (req, res, next) => jobController.delete(req, res, next)
);

jobRouter.get("/", (req, res, next) => jobController.getAll(req, res, next));

jobRouter.get(
  "/:id",
  authenticate,
  (req, res, next) => jobController.getById(req, res, next)
);

jobRouter.get(
  "/employer/:userId",
  (req, res, next) => jobController.getByCreator(req, res, next)
);

export default jobRouter;
