import { Request, Response } from "express";
import { razorpayPaymentService } from "@services/razorpayPayment.service";
import { verifyWebhookSignature } from "@utils/razorpay";
import { ApiResponse } from "@utils/ApiResponse";
import { ApiError } from "@utils/ApiError";
import { asyncHandler } from "@utils/asyncHandler";
import { CreateOrderBody, VerifyPaymentBody, MarkPaymentFailedBody } from "@validations/razorpay.validation";

// POST /api/v1/razorpay/order  (student only — creates an order for their own account)
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { amount } = req.body as CreateOrderBody;
  const studentId = req.auth!.id;

  const result = await razorpayPaymentService.createOrder({ studentId, amount });
  res.status(201).json(new ApiResponse(201, result, "Order created successfully"));
});

// POST /api/v1/razorpay/verify  (student only — called from the Checkout success handler)
export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body as VerifyPaymentBody;
  const result = await razorpayPaymentService.verifyPayment(payload);
  res.status(200).json(new ApiResponse(200, result, "Payment verified and fee records updated"));
});

// POST /api/v1/razorpay/failure  (student only — called from the Checkout failure/cancel handler)
export const markPaymentFailed = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body as MarkPaymentFailedBody;
  const payment = await razorpayPaymentService.markFailed(payload);
  res.status(200).json(new ApiResponse(200, payment, "Payment marked as failed"));
});

// POST /api/v1/razorpay/webhook  (public — Razorpay server calls this directly)
// NOTE: mounted in app.ts with express.raw() BEFORE the global JSON parser,
// so req.body here is a raw Buffer, not a parsed object.
export const razorpayWebhook = asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers["x-razorpay-signature"] as string | undefined;
  const rawBody = req.body as Buffer;

  if (!signature || !verifyWebhookSignature(rawBody.toString(), signature)) {
    throw ApiError.unauthorized("Invalid webhook signature");
  }

  const event = JSON.parse(rawBody.toString());
  await razorpayPaymentService.handleWebhookEvent(event);

  res.status(200).json(new ApiResponse(200, null, "Webhook processed"));
});
