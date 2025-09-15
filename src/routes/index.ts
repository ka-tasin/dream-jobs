import { Router } from "express";
import accountRouter from "./account.routes";
import jobRouter from "./job.routes";

const routes = Router();

routes.use("/auth", accountRouter);
routes.use("/jobs", jobRouter);

export default routes;
