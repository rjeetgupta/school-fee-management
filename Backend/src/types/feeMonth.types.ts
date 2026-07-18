import { Types } from "mongoose";

export enum FeeMonthStatus {
  PENDING = "Pending",
  PARTIAL = "Partial",
  PAID = "Paid",
}

export interface IFeeMonth {
  student: Types.ObjectId | string;
  /** "YYYY-MM" — one record per student per calendar month. */
  month: string;
  /** Fee amount generated for this month (snapshot of the student's monthly fee at generation time). */
  monthlyAmount: number;
  /** Total paid against this month so far (across one or more payments). */
  amountPaid: number;
  status: FeeMonthStatus;
}

export interface FeeMonthSummary {
  student: string;
  totalDue: number;
  pendingMonthsCount: number;
  pendingMonths: Array<{
    month: string;
    monthlyAmount: number;
    amountPaid: number;
    due: number;
    status: FeeMonthStatus;
  }>;
}

export interface ApplyPaymentResult {
  monthsUpdated: Array<{
    month: string;
    amountApplied: number;
    amountPaid: number;
    monthlyAmount: number;
    status: FeeMonthStatus;
  }>;
  totalApplied: number;
  remainingDue: number;
}
