import { PaymentModel, PaymentDocument } from "@models/payment.model";
import { Types } from "mongoose";

class PaymentRepository {
  async create(data: Partial<PaymentDocument>): Promise<PaymentDocument> {
    return PaymentModel.create(data);
  }

  async findById(id: string): Promise<PaymentDocument | null> {
    return PaymentModel.findById(id).exec();
  }

  async findByStudent(studentId: string): Promise<PaymentDocument[]> {
    return PaymentModel.find({ student: studentId }).sort({ paymentDate: -1 }).exec();
  }

  async findByRazorpayOrderId(razorpayOrderId: string): Promise<PaymentDocument | null> {
    return PaymentModel.findOne({ razorpayOrderId }).exec();
  }

  async updateById(
    id: string,
    data: Partial<PaymentDocument>
  ): Promise<PaymentDocument | null> {
    return PaymentModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async deleteById(id: string): Promise<PaymentDocument | null> {
    return PaymentModel.findByIdAndDelete(id).exec();
  }

  /**
   * Sum of successful payments within a date range (inclusive of start,
   * exclusive of end) — used for "today's" and "this month's" collection
   * figures on the admin dashboard.
   */
  async sumByDateRange(start: Date, end: Date): Promise<number> {
    const result = await PaymentModel.aggregate<{ total: number }>([
      {
        $match: {
          status: "Success",
          paymentDate: { $gte: start, $lt: end },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    return result[0]?.total ?? 0;
  }

  /** Most recent successful payments across all students, for the dashboard's activity feed. */
  async findRecent(limit: number): Promise<PaymentDocument[]> {
    return PaymentModel.find({ status: "Success" })
      .sort({ paymentDate: -1 })
      .limit(limit)
      .populate("student", "studentName admissionNumber class section")
      .exec();
  }

  /**
   * Sum of all payments made by a student, optionally excluding one payment
   * (used when editing that payment's amount, to recompute due against the
   * "rest" of the payment history before applying the new amount).
   */
  async sumByStudent(studentId: string, excludePaymentId?: string): Promise<number> {
    const match: Record<string, unknown> = { student: new Types.ObjectId(studentId) };
    if (excludePaymentId) {
      match._id = { $ne: excludePaymentId };
    }

    const result = await PaymentModel.aggregate<{ total: number }>([
      { $match: match },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    return result[0]?.total ?? 0;
  }
}

export const paymentRepository = new PaymentRepository();
