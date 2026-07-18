import { Request, Response } from "express";
import { studentAuthService } from "@services/studentAuth.service";
import { ApiResponse } from "@utils/ApiResponse";
import { asyncHandler } from "@utils/asyncHandler";
import { StudentLoginBody } from "@validations/studentAuth.validation";

// POST /api/v1/student-auth/login
export const studentLogin = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body as StudentLoginBody;
  const result = await studentAuthService.login(payload);
  res.status(200).json(new ApiResponse(200, result, "Logged in successfully"));
});
