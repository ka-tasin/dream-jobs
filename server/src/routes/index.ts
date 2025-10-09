import { Router } from "express";
import accountRouter from "./account.routes";
import jobRouter from "./job.routes";
import userRouter from "./user.routes";
import applicationRouter from "./application.routes";

const routes = Router();

routes.use("/auth", accountRouter);
routes.use("/jobs", jobRouter);
routes.use("/users", userRouter);
routes.use("/applications", applicationRouter);

export default routes;
