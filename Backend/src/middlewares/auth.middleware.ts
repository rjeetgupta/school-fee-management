import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@utils/jwt";
import { ApiError } from "@utils/ApiError";
import { JwtPayload } from "@app-types/auth.types";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /** Decoded JWT payload — present for both admin and student tokens; check `role` to tell them apart. */
      auth?: JwtPayload;
    }
  }
}

export function verifyJWT(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Authentication token missing"));
  }

  const token = header.split(" ")[1];

  try {
    req.auth = verifyToken(token);
    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
}

/** Use after verifyJWT to restrict a route to specific roles (e.g. requireRole("admin")). */
export function requireRole(...roles: Array<"admin" | "student">) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return next(ApiError.forbidden("You do not have access to this resource"));
    }
    next();
  };
}
