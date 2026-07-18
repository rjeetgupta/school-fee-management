import { Request, Response } from "express";
import { paymentService } from "@services/payment.service";
import { ApiResponse } from "@utils/ApiResponse";
import { asyncHandler } from "@utils/asyncHandler";
import { DepositFeeBody, UpdateDepositBody } from "@validations/payment.validation";

// POST /api/v1/payments  — deposit a fee payment
export const depositFee = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body as DepositFeeBody;
  const result = await paymentService.depositFee(payload);
  res.status(201).json(new ApiResponse(201, result, "Fee deposited successfully"));
});

// PATCH /api/v1/payments/:id  — correct a previously entered deposit
export const updateDeposit = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body as UpdateDepositBody;
  const result = await paymentService.updateDeposit(req.params.id, payload);
  res.status(200).json(new ApiResponse(200, result, "Deposit updated successfully"));
});

// DELETE /api/v1/payments/:id
export const deleteDeposit = asyncHandler(async (req: Request, res: Response) => {
  const result = await paymentService.deleteDeposit(req.params.id);
  res.status(200).json(new ApiResponse(200, result, "Deposit deleted successfully"));
});

// GET /api/v1/payments/student/:studentId
export const getPaymentsByStudent = asyncHandler(async (req: Request, res: Response) => {
  const payments = await paymentService.getPaymentsByStudent(req.params.studentId);
  res.status(200).json(new ApiResponse(200, payments, "Payment history fetched successfully"));
});
