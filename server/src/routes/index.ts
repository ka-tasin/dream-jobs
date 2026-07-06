import { Router } from "express";
import accountRouter from "../modules/account/account.routes.js";
import jobRouter from "../modules/job/job.routes.js";
import userRouter from "../modules/user/user.routes.js";
import applicationRouter from "../modules/application/application.routes.js";
import employerRouter from "../modules/employer/employer.routes.js";

const routes = Router();

routes.use("/auth", accountRouter);
routes.use("/jobs", jobRouter);
routes.use("/users", userRouter);
routes.use("/applications", applicationRouter);
routes.use("/employers", employerRouter);

export default routes;
