export interface RecentPayment {
  id: string;
  studentName: string;
  admissionNumber: string;
  class: string;
  section: string;
  amount: number;
  paymentMode?: string;
  channel: string;
  paymentDate: string;
  receiptNumber: string;
}

export interface DashboardSummary {
  totalStudents: number;
  todayCollection: number;
  monthCollection: number;
  totalOutstanding: number;
  recentPayments: RecentPayment[];
}
