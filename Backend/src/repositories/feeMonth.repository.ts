import { Types } from "mongoose";
import { FeeMonthModel, FeeMonthDocument } from "@models/feeMonth.model";
import { FeeMonthStatus } from "@app-types/feeMonth.types";

class FeeMonthRepository {
  async findByStudentAndMonth(studentId: string, month: string): Promise<FeeMonthDocument | null> {
    return FeeMonthModel.findOne({ student: studentId, month }).exec();
  }

  async create(data: Partial<FeeMonthDocument>): Promise<FeeMonthDocument> {
    return FeeMonthModel.create(data);
  }

  async findById(id: string): Promise<FeeMonthDocument | null> {
    return FeeMonthModel.findById(id).exec();
  }

  /** Full fee history for a student, most recent month first. */
  async findAllByStudent(studentId: string): Promise<FeeMonthDocument[]> {
    return FeeMonthModel.find({ student: studentId }).sort({ month: -1 }).exec();
  }

  /** Unpaid/partially-paid months for a student, oldest first (FIFO order for applying payments). */
  async findPendingByStudent(studentId: string): Promise<FeeMonthDocument[]> {
    return FeeMonthModel.find({
      student: studentId,
      status: { $in: [FeeMonthStatus.PENDING, FeeMonthStatus.PARTIAL] },
    })
      .sort({ month: 1 })
      .exec();
  }

  async updateById(id: string, data: Partial<FeeMonthDocument>): Promise<FeeMonthDocument | null> {
    return FeeMonthModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  /** Sum of outstanding due (monthlyAmount - amountPaid) across every unpaid/partial month. */
  async sumOutstandingByStudent(studentId: string): Promise<number> {
    const result = await FeeMonthModel.aggregate<{ total: number }>([
      {
        $match: {
          student: new Types.ObjectId(studentId),
          status: { $in: [FeeMonthStatus.PENDING, FeeMonthStatus.PARTIAL] },
        },
      },
      { $group: { _id: null, total: { $sum: { $subtract: ["$monthlyAmount", "$amountPaid"] } } } },
    ]);

    return result[0]?.total ?? 0;
  }
  /** Sum of outstanding due across EVERY student — the dashboard's "Total Outstanding Fee". */
  async sumOutstandingAll(): Promise<number> {
    const result = await FeeMonthModel.aggregate<{ total: number }>([
      { $match: { status: { $in: [FeeMonthStatus.PENDING, FeeMonthStatus.PARTIAL] } } },
      { $group: { _id: null, total: { $sum: { $subtract: ["$monthlyAmount", "$amountPaid"] } } } },
    ]);

    return result[0]?.total ?? 0;
  }
}

export const feeMonthRepository = new FeeMonthRepository();
