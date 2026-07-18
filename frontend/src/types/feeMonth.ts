export type FeeMonthStatus = "Pending" | "Partial" | "Paid";

export interface FeeMonth {
  _id: string;
  student: string;
  month: string; // "YYYY-MM"
  monthlyAmount: number;
  amountPaid: number;
  status: FeeMonthStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PendingMonth {
  month: string;
  monthlyAmount: number;
  amountPaid: number;
  due: number;
  status: FeeMonthStatus;
}

export interface FeeSummary {
  student: string;
  totalDue: number;
  pendingMonthsCount: number;
  pendingMonths: PendingMonth[];
}
