export const TYPES = {
  UserController: Symbol.for("UserController"),
  IUserRepository: Symbol.for("IUserRepository"),
  IUserService: Symbol.for("IUserService"),

  IJobRepository: Symbol.for("IJobRepository"),
  IJobService: Symbol.for("IJobService"),
  JobController: Symbol.for("JobController"),

  IApplicationRepository: Symbol.for("IApplicationRepository"),
  IApplicationService: Symbol.for("IApplicationService"),
  ApplicationController: Symbol.for("ApplicationController"),

  AccountController: Symbol.for("AccountController"),
  AuthMiddleware: Symbol.for("AuthMiddleware"),

  RoleMiddleware: Symbol.for("RoleMiddleware"),

  IUnitOfService: Symbol.for("IUnitOfService"),

  IUnitOfWork: Symbol.for("IUnitOfWork"),
};
