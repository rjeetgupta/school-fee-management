import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { ApiError } from "@utils/ApiError";

/**
 * Validates req.{body,query,params} against a Zod schema shaped as:
 * z.object({ body: ..., query: ..., params: ... })
 * Only include the keys you actually want validated in the schema.
 */
export const validate =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed.body) req.body = parsed.body;
      if (parsed.params) req.params = parsed.params;
      // query is left as-is (Express 5 makes req.query read-only in types);
      // controllers should read validated query via res.locals if reassignment is needed.

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        return next(ApiError.badRequest("Validation failed", formattedErrors));
      }
      next(error);
    }
  };
