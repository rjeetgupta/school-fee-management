import { Types } from "mongoose";

export enum PaymentMode {
  CASH = "Cash",
  UPI = "UPI",
  BANK_TRANSFER = "Bank Transfer",
  CHEQUE = "Cheque",
}

export interface IPayment {
  student: Types.ObjectId | string;
  amount: number;
  paymentMode: PaymentMode;
  receiptNumber: string;
  remarks?: string;
  paymentDate: Date;
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
