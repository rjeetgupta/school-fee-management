import { Request, Response } from "express";
import { feeMonthService } from "@services/feeMonth.service";
import { ApiResponse } from "@utils/ApiResponse";
import { asyncHandler } from "@utils/asyncHandler";

// POST /api/v1/fee-months/student/:studentId/generate
export const generateMonthlyFee = asyncHandler(async (req: Request, res: Response) => {
  const { month } = req.body as { month?: string };
  const feeMonth = await feeMonthService.generateMonthlyFee(req.params.studentId, month);
  res.status(201).json(new ApiResponse(201, feeMonth, "Monthly fee ensured"));
});

// GET /api/v1/fee-months/student/:studentId/history
export const getFeeHistory = asyncHandler(async (req: Request, res: Response) => {
  const history = await feeMonthService.getFeeHistory(req.params.studentId);
  res.status(200).json(new ApiResponse(200, history, "Fee history fetched successfully"));
});

// GET /api/v1/fee-months/student/:studentId/summary
export const getFeeSummary = asyncHandler(async (req: Request, res: Response) => {
  const summary = await feeMonthService.getFeeSummary(req.params.studentId);
  res.status(200).json(new ApiResponse(200, summary, "Fee summary fetched successfully"));
});
