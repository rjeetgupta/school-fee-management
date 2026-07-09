/**
 * Standardized application error class.
 * Throw this anywhere in controllers/services/repositories;
 * the global error middleware will format the response consistently.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly success: boolean;
  public readonly errors: unknown[];
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message = "Something went wrong",
    errors: unknown[] = [],
    stack = ""
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message = "Bad Request", errors: unknown[] = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = "Unauthorized", errors: unknown[] = []) {
    return new ApiError(401, message, errors);
  }

  static forbidden(message = "Forbidden", errors: unknown[] = []) {
    return new ApiError(403, message, errors);
  }

  static notFound(message = "Resource not found", errors: unknown[] = []) {
    return new ApiError(404, message, errors);
  }

  static conflict(message = "Conflict", errors: unknown[] = []) {
    return new ApiError(409, message, errors);
  }

  static internal(message = "Internal Server Error", errors: unknown[] = []) {
    return new ApiError(500, message, errors);
  }
}
