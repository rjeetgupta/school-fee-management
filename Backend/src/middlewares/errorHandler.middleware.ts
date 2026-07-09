import { Request, Response, NextFunction } from "express";
import { ApiError } from "@utils/ApiError";
import { env } from "@config/env";

/**
 * Must be registered LAST in server.ts, after all routes.
 * Catches errors forwarded via next(error) or thrown in async handlers
 * (when wrapped with asyncHandler).
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  let apiError: ApiError;

  if (err instanceof ApiError) {
    apiError = err;
  } else if (err instanceof Error) {
    // Handle known Mongoose errors gracefully
    if (err.name === "CastError") {
      apiError = ApiError.badRequest("Invalid identifier format");
    } else if (err.name === "ValidationError") {
      apiError = ApiError.badRequest(err.message);
    } else if ((err as { code?: number }).code === 11000) {
      apiError = ApiError.conflict("Duplicate value violates a unique constraint");
    } else {
      apiError = ApiError.internal(err.message);
    }
  } else {
    apiError = ApiError.internal("Unknown error occurred");
  }

  if (env.nodeEnv === "development" && !(err instanceof ApiError)) {
    console.error(err);
  }

  res.status(apiError.statusCode).json({
    success: apiError.success,
    statusCode: apiError.statusCode,
    message: apiError.message,
    errors: apiError.errors,
    ...(env.nodeEnv === "development" ? { stack: apiError.stack } : {}),
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}
