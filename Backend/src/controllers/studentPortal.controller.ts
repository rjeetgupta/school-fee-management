import { Request, Response } from "express";
import { studentService } from "@services/student.service";
import { feeMonthService } from "@services/feeMonth.service";
import { paymentService } from "@services/payment.service";
import { ApiResponse } from "@utils/ApiResponse";
import { asyncHandler } from "@utils/asyncHandler";

// GET /api/v1/student-portal/me
export const getMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const student = await studentService.getStudentById(req.auth!.id);
  res.status(200).json(new ApiResponse(200, student, "Profile fetched successfully"));
});

// GET /api/v1/student-portal/fee-summary
export const getMyFeeSummary = asyncHandler(async (req: Request, res: Response) => {
  const summary = await feeMonthService.getFeeSummary(req.auth!.id);
  res.status(200).json(new ApiResponse(200, summary, "Fee summary fetched successfully"));
});

// GET /api/v1/student-portal/fee-history
export const getMyFeeHistory = asyncHandler(async (req: Request, res: Response) => {
  const history = await feeMonthService.getFeeHistory(req.auth!.id);
  res.status(200).json(new ApiResponse(200, history, "Fee history fetched successfully"));
});

// GET /api/v1/student-portal/payments
export const getMyPayments = asyncHandler(async (req: Request, res: Response) => {
  const payments = await paymentService.getPaymentsByStudent(req.auth!.id);
  res.status(200).json(new ApiResponse(200, payments, "Payment history fetched successfully"));
});
