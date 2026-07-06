export class ApiError extends Error {
  status: number;
  statusCode: number; 
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.status = statusCode;
    this.statusCode = statusCode; 
    this.isOperational = isOperational;
    
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found") {
    super(404, message);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = "Bad request") {
    super(400, message);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized") {
    super(401, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Forbidden") {
    super(403, message);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = "Resource already exists") {
    super(409, message);
  }
}