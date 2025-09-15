import { Router } from "express";
import container from "../config/ioc.config";
import JobController from "../controllers/job.controller";
import { TYPES } from "../config/ioc.types";

const jobRouter = Router();
const jobController = container.get<JobController>(TYPES.JobController);

jobRouter.post("/", jobController.create.bind(jobController));
jobRouter.get("/", jobController.getAll.bind(jobController));
jobRouter.get("/:id", jobController.getById.bind(jobController));
jobRouter.get(
  "/employer/:userId",
  jobController.getByCreator.bind(jobController)
);
jobRouter.delete("/:id", jobController.delete.bind(jobController));

export default jobRouter;
