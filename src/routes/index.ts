import { Router } from "express";
import accountRouter from "./account.routes";

const routes = Router();

routes.use("/auth", accountRouter);

export default routes;
