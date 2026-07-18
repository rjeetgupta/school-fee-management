import { studentRepository } from "@repositories/student.repository";
import { paymentRepository } from "@repositories/payment.repository";
import { feeMonthRepository } from "@repositories/feeMonth.repository";
import { DashboardSummary, RecentPaymentSummary } from "@app-types/dashboard.types";
import { StudentDocument } from "@models/student.model";

class DashboardService {
  async getSummary(): Promise<DashboardSummary> {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [totalStudents, todayCollection, monthCollection, totalOutstanding, recentPaymentDocs] =
      await Promise.all([
        studentRepository.countAll(),
        paymentRepository.sumByDateRange(startOfToday, startOfTomorrow),
        paymentRepository.sumByDateRange(startOfMonth, startOfNextMonth),
        feeMonthRepository.sumOutstandingAll(),
        paymentRepository.findRecent(8),
      ]);

    const recentPayments: RecentPaymentSummary[] = recentPaymentDocs.map((payment) => {
      // Populated at the repository level; cast since Mongoose's populate isn't reflected in the static type.
      const student = payment.student as unknown as StudentDocument;

      return {
        id: payment._id.toString(),
        studentName: student?.studentName ?? "Unknown",
        admissionNumber: student?.admissionNumber ?? "—",
        class: student?.class ?? "—",
        section: student?.section ?? "—",
        amount: payment.amount,
        paymentMode: payment.paymentMode,
        channel: payment.channel,
        paymentDate: payment.paymentDate,
        receiptNumber: payment.receiptNumber,
      };
    });

    return {
      totalStudents,
      todayCollection,
      monthCollection,
      totalOutstanding,
      recentPayments,
    };
  }
}

export const dashboardService = new DashboardService();
