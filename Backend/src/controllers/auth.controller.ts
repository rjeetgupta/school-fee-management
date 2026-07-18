import { Request, Response } from "express";
import { authService } from "@services/auth.service";
import { ApiResponse } from "@utils/ApiResponse";
import { asyncHandler } from "@utils/asyncHandler";
import { LoginBody } from "@validations/auth.validation";

// POST /api/v1/auth/login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body as LoginBody;
  const result = await authService.login(payload);
  res.status(200).json(new ApiResponse(200, result, "Logged in successfully"));
});
