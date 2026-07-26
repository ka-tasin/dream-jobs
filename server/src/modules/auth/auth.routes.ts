import { Router } from "express";
import { accountController } from "./auth.controller.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { createUserSchema, loginSchema } from "../user/user.validation.js";
import { authLimiter } from "../../middlewares/rateLimiter.middleware.js";
import passport from "../../config/passport.config.js";

const accountRouter = Router();

accountRouter.post(
  "/register",
  authLimiter,
  validate(createUserSchema),
  (req, res, next) => accountController.register(req, res, next)
);

accountRouter.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  (req, res, next) => accountController.login(req, res, next)
);

accountRouter.post(
  "/logout",
  (req, res, next) => accountController.logout(req, res, next)
);

accountRouter.post(
  "/verifyToken",
  (req, res, next) => accountController.verifyToken(req, res, next)
);

accountRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

accountRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res, next) => accountController.googleCallback(req, res, next)
);

export default accountRouter;
