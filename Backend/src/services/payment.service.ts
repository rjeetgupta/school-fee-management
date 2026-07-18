import { paymentRepository } from "@repositories/payment.repository";
import { studentRepository } from "@repositories/student.repository";
import { counterRepository } from "@repositories/counter.repository";
import { feeMonthService } from "@services/feeMonth.service";
import { generateReceiptNumber } from "@utils/generateReceiptNumber";
import { ApiError } from "@utils/ApiError";
import { PaymentDocument } from "@models/payment.model";
import { PaymentStatus, PaymentChannel, DepositFeeInput, UpdateDepositInput } from "@app-types/payment.types";
import { ApplyPaymentResult, FeeMonthSummary } from "@app-types/feeMonth.types";

export interface DepositResult {
  payment: PaymentDocument;
  ledger: ApplyPaymentResult;
  feeSummary: FeeMonthSummary;
}

/**
 * Admin-recorded fee collection (cash or admin-assisted online) — this is
 * the Admin Module's "record a payment on behalf of a student" flow.
 * The Monthly Fee Ledger (feeMonth.service.ts) is the source of truth for
 * dues: every deposit/correction/deletion here goes through it (FIFO
 * settlement, oldest unpaid month first) rather than touching a single
 * denormalized due figure, so a student's due is never inconsistent with
 * their actual month-by-month payment history.
 */
class PaymentService {
  /**
   * Records a fee payment an admin collected from a student — in cash, or
   * online on the student's behalf. Settles the student's oldest unpaid
   * month(s) first (Business Rule 3 — and the carry-forward mechanism —
   * are both enforced inside feeMonthService.applyPayment).
   */
  async depositFee(input: DepositFeeInput): Promise<DepositResult> {
    const student = await studentRepository.findById(input.studentId);
    if (!student) {
      throw ApiError.notFound("Student not found");
    }

    // Throws if amount exceeds outstanding due — before we generate a
    // receipt or create a payment record for it.
    const ledger = await feeMonthService.applyPayment(input.studentId, input.amount);

    const year = new Date().getFullYear();
    const sequence = await counterRepository.getNextSequence(`receipt-${year}`);
    const receiptNumber = generateReceiptNumber(sequence, year);

    const payment = await paymentRepository.create({
      student: student._id,
      amount: input.amount,
      paymentMode: input.paymentMode,
      status: PaymentStatus.SUCCESS,
      channel: PaymentChannel.ADMIN,
      remarks: input.remarks,
      receiptNumber,
      paymentDate: new Date(),
    });

    const feeSummary = await feeMonthService.getFeeSummary(input.studentId);

    return { payment, ledger, feeSummary };
  }

  /**
   * Correct a previously entered deposit amount (or other editable fields).
   * Business Rule 6: editing a payment must update all reports — here that
   * means unwinding the old amount's effect on the ledger and reapplying the
   * new amount from scratch (both via feeMonth.service.ts), rather than
   * patching a single stored due figure. This keeps due correct even if the
   * same payment is corrected more than once.
   */
  async updateDeposit(paymentId: string, input: UpdateDepositInput): Promise<DepositResult> {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) {
      throw ApiError.notFound("Payment not found");
    }

    if (payment.status !== PaymentStatus.SUCCESS) {
      throw ApiError.badRequest("Only successfully recorded payments can be corrected");
    }

    const studentId = payment.student.toString();
    const newAmount = input.amount ?? payment.amount;

    if (newAmount <= 0) {
      throw ApiError.badRequest("Amount must be greater than 0");
    }

    // Undo this payment's old effect on the ledger, then reapply the new
    // amount — applyPayment() re-validates against the (now-reopened) due.
    await feeMonthService.reversePayment(studentId, payment.amount);
    const ledger = await feeMonthService.applyPayment(studentId, newAmount);

    const updatedPayment = await paymentRepository.updateById(paymentId, {
      amount: newAmount,
      paymentMode: input.paymentMode ?? payment.paymentMode,
      remarks: input.remarks ?? payment.remarks,
    });

    const feeSummary = await feeMonthService.getFeeSummary(studentId);

    return {
      payment: updatedPayment as PaymentDocument,
      ledger,
      feeSummary,
    };
  }

  /**
   * Business Rule 5: deleting a payment must recalculate all dues
   * automatically — done here by reversing its effect on the ledger before
   * removing the payment record.
   */
  async deleteDeposit(paymentId: string): Promise<DepositResult> {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) {
      throw ApiError.notFound("Payment not found");
    }

    const studentId = payment.student.toString();

    if (payment.status === PaymentStatus.SUCCESS) {
      await feeMonthService.reversePayment(studentId, payment.amount);
    }

    await paymentRepository.deleteById(paymentId);

    const feeSummary = await feeMonthService.getFeeSummary(studentId);

    return {
      payment,
      ledger: { monthsUpdated: [], totalApplied: 0, remainingDue: feeSummary.totalDue },
      feeSummary,
    };
  }

  async getPaymentsByStudent(studentId: string): Promise<PaymentDocument[]> {
    const student = await studentRepository.findById(studentId);
    if (!student) {
      throw ApiError.notFound("Student not found");
    }
    return paymentRepository.findByStudent(studentId);
  }
}

export const paymentService = new PaymentService();
