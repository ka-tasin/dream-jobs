import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error stack in development, or just the message in production
  if (process.env.NODE_ENV === "development") {
    console.error(err);
  } else {
    console.error(`[Error] ${err.message || err}`);
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }

  // Prisma or database constraints errors
  if (err.code && err.code.startsWith("P")) {
    res.status(400).json({
      success: false,
      message: "Database operation failed",
      detail: err.meta?.target ? `Duplicate value for unique field: ${err.meta.target}` : err.message,
    });
    return;
  }

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
