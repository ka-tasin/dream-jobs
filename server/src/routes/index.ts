import { Router } from "express";
import accountRouter from "../modules/account/account.routes";
import jobRouter from "../modules/job/job.routes";
import userRouter from "../modules/user/user.routes";
import applicationRouter from "../modules/application/application.routes";

const routes = Router();

routes.use("/auth", accountRouter);
routes.use("/jobs", jobRouter);
routes.use("/users", userRouter);
routes.use("/applications", applicationRouter);

export default routes;
