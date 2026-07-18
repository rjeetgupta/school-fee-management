import { Request, Response } from "express";
import { dashboardService } from "@services/dashboard.service";
import { ApiResponse } from "@utils/ApiResponse";
import { asyncHandler } from "@utils/asyncHandler";

// GET /api/v1/dashboard/summary
export const getDashboardSummary = asyncHandler(async (_req: Request, res: Response) => {
  const summary = await dashboardService.getSummary();
  res.status(200).json(new ApiResponse(200, summary, "Dashboard summary fetched successfully"));
});
