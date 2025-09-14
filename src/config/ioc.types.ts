export const TYPES = {
  UserController: Symbol.for("UserController"),
  IUserRepository: Symbol.for("IUserRepository"),
  IUserService: Symbol.for("IUserService"),

  AccountController: Symbol.for("AccountController"),
  AuthMiddleware: Symbol.for("AuthMiddleware"),

  IUnitOfService: Symbol.for("IUnitOfService"),

  IUnitOfWork: Symbol.for("IUnitOfWork"),
};
