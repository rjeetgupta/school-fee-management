import type { Student } from "@/types/student";

export const PAYMENT_MODES = ["Cash", "UPI", "Bank Transfer", "Cheque"] as const;
export type PaymentMode = (typeof PAYMENT_MODES)[number];

export interface Payment {
  _id: string;
  student: string;
  amount: number;
  paymentMode: PaymentMode;
  receiptNumber: string;
  remarks?: string;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepositResult {
  payment: Payment;
  student: Student;
}
