import { z } from "zod";
import { PaymentMode } from "@app-types/payment.types";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const depositFeeSchema = z.object({
  body: z.object({
    studentId: z.string().regex(objectIdRegex, "Invalid student id"),
    amount: z.coerce
      .number({ invalid_type_error: "Amount must be a number" })
      .positive("Amount must be greater than 0"),
    paymentMode: z.nativeEnum(PaymentMode, { invalid_type_error: "Invalid payment mode" }),
    remarks: z.string().trim().optional(),
  }),
});

export const updateDepositSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "Invalid payment id"),
  }),
  body: z.object({
    amount: z.coerce.number().positive("Amount must be greater than 0").optional(),
    paymentMode: z.nativeEnum(PaymentMode).optional(),
    remarks: z.string().trim().optional(),
  }),
});

export const paymentIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "Invalid payment id"),
  }),
});

export const studentIdParamSchema = z.object({
  params: z.object({
    studentId: z.string().regex(objectIdRegex, "Invalid student id"),
  }),
});

export type DepositFeeBody = z.infer<typeof depositFeeSchema>["body"];
export type UpdateDepositBody = z.infer<typeof updateDepositSchema>["body"];
