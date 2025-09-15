export const TYPES = {
  UserController: Symbol.for("UserController"),
  IUserRepository: Symbol.for("IUserRepository"),
  IUserService: Symbol.for("IUserService"),

  IJobRepository: Symbol.for("IJobRepository"),
  IJobService: Symbol.for("IJobService"),
  JobController: Symbol.for("JobController"),

  AccountController: Symbol.for("AccountController"),
  AuthMiddleware: Symbol.for("AuthMiddleware"),

  IUnitOfService: Symbol.for("IUnitOfService"),

  IUnitOfWork: Symbol.for("IUnitOfWork"),
};
