import { paymentRepository } from "@repositories/payment.repository";
import { studentRepository } from "@repositories/student.repository";
import { counterRepository } from "@repositories/counter.repository";
import { generateReceiptNumber } from "@utils/generateReceiptNumber";
import { ApiError } from "@utils/ApiError";
import { PaymentDocument } from "@models/payment.model";
import { StudentDocument } from "@models/student.model";
import { DepositFeeInput, UpdateDepositInput } from "@app-types/payment.types";

export interface DepositResult {
  payment: PaymentDocument;
  student: StudentDocument;
}

class PaymentService {
  /**
   * Deposit a fee payment against a student.
   * - Validates the student exists.
   * - Enforces Business Rule 3: payment cannot exceed the outstanding due.
   * - Generates a unique receipt number (RCP-YYYY-00001).
   * - Recalculates and persists the student's dueFee.
   */
  async depositFee(input: DepositFeeInput): Promise<DepositResult> {
    const student = await studentRepository.findById(input.studentId);
    if (!student) {
      throw ApiError.notFound("Student not found");
    }

    const currentDue = student.dueFee ?? 0;

    if (input.amount > currentDue) {
      throw ApiError.badRequest(
        `Amount exceeds outstanding due. Outstanding due is ${currentDue}.`
      );
    }

    const year = new Date().getFullYear();
    const sequence = await counterRepository.getNextSequence(`receipt-${year}`);
    const receiptNumber = generateReceiptNumber(sequence, year);

    const payment = await paymentRepository.create({
      student: student._id,
      amount: input.amount,
      paymentMode: input.paymentMode,
      remarks: input.remarks,
      receiptNumber,
      paymentDate: new Date(),
    });

    const updatedStudent = await studentRepository.updateById(input.studentId, {
      dueFee: currentDue - input.amount,
    });

    return { payment, student: updatedStudent as StudentDocument };
  }

  /**
   * Correct a previously entered deposit amount (or other editable fields).
   * Business Rule 6: editing a payment must update all reports — here that
   * means recalculating the student's dueFee from the full payment history
   * rather than doing a simple delta adjustment, so due can never drift out
   * of sync even if this endpoint is called more than once for the same
   * correction.
   */
  async updateDeposit(paymentId: string, input: UpdateDepositInput): Promise<DepositResult> {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) {
      throw ApiError.notFound("Payment not found");
    }

    const student = await studentRepository.findById(payment.student.toString());
    if (!student) {
      throw ApiError.notFound("Student not found for this payment");
    }

    const newAmount = input.amount ?? payment.amount;

    if (newAmount <= 0) {
      throw ApiError.badRequest("Amount must be greater than 0");
    }

    // Total paid by every OTHER payment for this student, excluding the one being edited.
    const totalPaidExcludingThis = await paymentRepository.sumByStudent(
      student._id.toString(),
      paymentId
    );

    const totalFee = student.totalFee ?? 0;
    const newDue = totalFee - (totalPaidExcludingThis + newAmount);

    if (newDue < 0) {
      throw ApiError.badRequest(
        `Updated amount exceeds the student's total fee. Maximum allowed amount is ${
          totalFee - totalPaidExcludingThis
        }.`
      );
    }

    const updatedPayment = await paymentRepository.updateById(paymentId, {
      amount: newAmount,
      paymentMode: input.paymentMode ?? payment.paymentMode,
      remarks: input.remarks ?? payment.remarks,
    });

    const updatedStudent = await studentRepository.updateById(student._id.toString(), {
      dueFee: newDue,
    });

    return {
      payment: updatedPayment as PaymentDocument,
      student: updatedStudent as StudentDocument,
    };
  }

  /**
   * Business Rule 5: deleting a payment must recalculate all dues automatically.
   */
  async deleteDeposit(paymentId: string): Promise<DepositResult> {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) {
      throw ApiError.notFound("Payment not found");
    }

    const student = await studentRepository.findById(payment.student.toString());
    if (!student) {
      throw ApiError.notFound("Student not found for this payment");
    }

    await paymentRepository.deleteById(paymentId);

    const totalPaidRemaining = await paymentRepository.sumByStudent(student._id.toString());
    const totalFee = student.totalFee ?? 0;
    const newDue = Math.max(totalFee - totalPaidRemaining, 0);

    const updatedStudent = await studentRepository.updateById(student._id.toString(), {
      dueFee: newDue,
    });

    return { payment, student: updatedStudent as StudentDocument };
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
