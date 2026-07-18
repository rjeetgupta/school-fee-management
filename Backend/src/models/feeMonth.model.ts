import { Schema, model, Document, Types } from "mongoose";
import { IFeeMonth, FeeMonthStatus } from "@app-types/feeMonth.types";

export interface FeeMonthDocument extends IFeeMonth, Document {
  student: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const feeMonthSchema = new Schema<FeeMonthDocument>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    month: {
      type: String,
      required: true,
      // "YYYY-MM"
      match: /^\d{4}-\d{2}$/,
    },
    monthlyAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(FeeMonthStatus),
      default: FeeMonthStatus.PENDING,
    },
  },
  { timestamps: true }
);

// One fee record per student per month — generateMonthlyFee() must stay idempotent against this.
feeMonthSchema.index({ student: 1, month: 1 }, { unique: true });

export const FeeMonthModel = model<FeeMonthDocument>("FeeMonth", feeMonthSchema);
