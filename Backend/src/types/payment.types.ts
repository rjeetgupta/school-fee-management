import { Types } from "mongoose";

export enum PaymentMode {
  CASH = "Cash",
  UPI = "UPI",
  BANK_TRANSFER = "Bank Transfer",
  CHEQUE = "Cheque",
  CARD = "Card",
  NET_BANKING = "Net Banking",
  WALLET = "Wallet",
  OTHER = "Other",
}

export enum PaymentStatus {
  CREATED = "Created", // Razorpay order created, awaiting checkout completion
  SUCCESS = "Success",
  FAILED = "Failed",
}

/** Who/how the payment was collected — distinct from paymentMode (UPI/Card/etc, the instrument used). */
export enum PaymentChannel {
  ADMIN = "Admin", // recorded by the admin (cash or admin-assisted online)
  STUDENT_ONLINE = "Student Online", // self-serve Razorpay checkout
}

export interface IPayment {
  student: Types.ObjectId | string;
  amount: number;
  /** Unknown until a Razorpay payment is captured, so optional at the schema level. */
  paymentMode?: PaymentMode;
  status: PaymentStatus;
  channel: PaymentChannel;
  receiptNumber: string;
  remarks?: string;
  paymentDate: Date;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

export interface DepositFeeInput {
  studentId: string;
  amount: number;
  paymentMode: PaymentMode;
  remarks?: string;
}

export interface UpdateDepositInput {
  amount?: number;
  paymentMode?: PaymentMode;
  remarks?: string;
}

export interface CreateRazorpayOrderInput {
  studentId: string;
  amount: number;
}

export interface CreateRazorpayOrderResult {
  paymentId: string;
  razorpayOrderId: string;
  amount: number; // in paise, as returned by Razorpay
  currency: string;
  keyId: string;
}

export interface VerifyRazorpayPaymentInput {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface MarkPaymentFailedInput {
  razorpayOrderId: string;
  reason?: string;
}
