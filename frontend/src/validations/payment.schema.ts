import { z } from "zod";
import { PAYMENT_MODES } from "@/types/payment";

export const depositFormSchema = z.object({
  amount: z.coerce
    .number({ error: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  paymentMode: z.enum(PAYMENT_MODES, { error: "Select a payment mode" }),
  remarks: z.string().trim().optional(),
});

export type DepositFormValues = z.input<typeof depositFormSchema>;

export const depositFormDefaults: DepositFormValues = {
  amount: 0,
  paymentMode: "Cash",
  remarks: "",
};

/** Search form on the deposit dialog's first step — find the student. */
export const studentSearchFormSchema = z.object({
  query: z.string().trim().min(1, "Enter an admission number, name, or mobile number"),
});

export type StudentSearchFormValues = z.input<typeof studentSearchFormSchema>;
