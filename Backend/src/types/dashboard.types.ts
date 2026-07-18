export interface RecentPaymentSummary {
  id: string;
  studentName: string;
  admissionNumber: string;
  class: string;
  section: string;
  amount: number;
  paymentMode?: string;
  channel: string;
  paymentDate: Date;
  receiptNumber: string;
}

export interface DashboardSummary {
  totalStudents: number;
  todayCollection: number;
  monthCollection: number;
  totalOutstanding: number;
  recentPayments: RecentPaymentSummary[];
}
