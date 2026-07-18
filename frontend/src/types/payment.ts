import type { FeeSummary } from "@/types/feeMonth";

export const PAYMENT_MODES = [
  "Cash",
  "UPI",
  "Bank Transfer",
  "Cheque",
  "Card",
  "Net Banking",
  "Wallet",
  "Other"
] as const;
export type PaymentMode = (typeof PAYMENT_MODES)[number];

export type PaymentStatus = "Created" | "Success" | "Failed";
export type PaymentChannel = "Admin" | "Student Online";

export interface Payment {
  _id: string;
  student: string;
  amount: number;
  paymentMode?: PaymentMode;
  status: PaymentStatus;
  channel: PaymentChannel;
  receiptNumber: string;
  remarks?: string;
  paymentDate: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonthUpdate {
  month: string;
  amountApplied: number;
  amountPaid: number;
  monthlyAmount: number;
  status: string;
}

export interface LedgerResult {
  monthsUpdated: MonthUpdate[];
  totalApplied: number;
  remainingDue: number;
}

export interface DepositResult {
  payment: Payment;
  ledger: LedgerResult;
  feeSummary: FeeSummary;
}
