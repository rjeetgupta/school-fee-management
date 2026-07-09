import { Schema, model, Document, Types } from "mongoose";
import { IPayment, PaymentMode } from "@app-types/payment.types";

export interface PaymentDocument extends IPayment, Document {
  student: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<PaymentDocument>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMode: {
      type: String,
      enum: Object.values(PaymentMode),
      required: true,
    },
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true, // Rule 8: monthly reports are based on payment dates
    },
  },
  { timestamps: true }
);

export const PaymentModel = model<PaymentDocument>("Payment", paymentSchema);
