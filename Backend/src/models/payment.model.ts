import { Schema, model, Document, Types } from "mongoose";
import { IPayment, PaymentMode, PaymentStatus, PaymentChannel } from "@app-types/payment.types";

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
      // Not required at the schema level: a Razorpay order is created before
      // the payment instrument (UPI/Card/etc) is known — it's filled in once
      // the payment is captured. Admin-recorded payments always supply it
      // (enforced in payment.validation.ts).
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
      default: PaymentStatus.SUCCESS,
      index: true,
    },
    channel: {
      type: String,
      enum: Object.values(PaymentChannel),
      required: true,
      default: PaymentChannel.ADMIN,
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
    razorpayOrderId: {
      type: String,
      trim: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      trim: true,
    },
    razorpaySignature: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const PaymentModel = model<PaymentDocument>("Payment", paymentSchema);
