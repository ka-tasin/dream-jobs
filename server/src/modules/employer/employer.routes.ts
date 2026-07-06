import { Router } from "express";
import { employerController } from "./employer.controller.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { Role } from "../../../prisma/generated/prisma/index.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { createEmployerSchema, updateEmployerSchema } from "./employer.validation.js";

const employerRouter = Router();

employerRouter.post(
  "/become-employer",
  authenticate,
  validate(createEmployerSchema),
  (req, res, next) => employerController.createEmployer(req, res, next)
);

employerRouter.put(
  "/",
  authenticate,
  authorize([Role.EMPLOYER, Role.ADMIN]),
  validate(updateEmployerSchema),
  (req, res, next) => employerController.updateEmployer(req, res, next)
);

employerRouter.get(
  "/profile",
  authenticate,
  (req, res, next) => employerController.getMyEmployerProfile(req, res, next)
);

employerRouter.get(
  "/user/:userId",
  (req, res, next) => employerController.getEmployerByUserId(req, res, next)
);

employerRouter.get(
  "/:id",
  (req, res, next) => employerController.getEmployerById(req, res, next)
);

employerRouter.get(
  "/",
  (req, res, next) => employerController.getAllEmployers(req, res, next)
);

employerRouter.delete(
  "/:id",
  authenticate,
  authorize([Role.ADMIN]),
  (req, res, next) => employerController.deleteEmployer(req, res, next)
);

export default employerRouter;