import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    amount: z.coerce
      .number({ invalid_type_error: "Amount must be a number" })
      .positive("Amount must be greater than 0"),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    razorpayOrderId: z.string().min(1, "razorpayOrderId is required"),
    razorpayPaymentId: z.string().min(1, "razorpayPaymentId is required"),
    razorpaySignature: z.string().min(1, "razorpaySignature is required"),
  }),
});

export const markPaymentFailedSchema = z.object({
  body: z.object({
    razorpayOrderId: z.string().min(1, "razorpayOrderId is required"),
    reason: z.string().trim().optional(),
  }),
});

export type CreateOrderBody = z.infer<typeof createOrderSchema>["body"];
export type VerifyPaymentBody = z.infer<typeof verifyPaymentSchema>["body"];
export type MarkPaymentFailedBody = z.infer<typeof markPaymentFailedSchema>["body"];
