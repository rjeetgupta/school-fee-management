import { paymentRepository } from "@repositories/payment.repository";
import { counterRepository } from "@repositories/counter.repository";
import { feeMonthService } from "@services/feeMonth.service";
import { generateReceiptNumber } from "@utils/generateReceiptNumber";
import { ApiError } from "@utils/ApiError";
import {
  razorpayInstance,
  verifyPaymentSignature,
  mapRazorpayMethodToPaymentMode,
} from "@utils/razorpay";
import { env } from "@config/env";
import { Types } from "mongoose";
import { PaymentDocument } from "@models/payment.model";
import {
  PaymentStatus,
  PaymentChannel,
  CreateRazorpayOrderInput,
  CreateRazorpayOrderResult,
  VerifyRazorpayPaymentInput,
  MarkPaymentFailedInput,
} from "@app-types/payment.types";
import { ApplyPaymentResult } from "@app-types/feeMonth.types";

export interface VerifyPaymentResult {
  payment: PaymentDocument;
  ledger: ApplyPaymentResult;
}

class RazorpayPaymentService {
  /**
   * Creates a Razorpay order for the given amount and a matching local
   * Payment record (status: Created). The fee ledger is NOT touched here —
   * it's only updated once verifyPayment() confirms the signature, so a
   * student can retry as many times as needed after a failure/cancellation
   * without any risk of double-crediting or partial updates.
   */
  async createOrder(input: CreateRazorpayOrderInput): Promise<CreateRazorpayOrderResult> {
    const { studentId, amount } = input;

    const totalDue = await feeMonthService.getTotalDue(studentId);
    if (amount > totalDue) {
      throw ApiError.badRequest(
        `Amount exceeds total outstanding due. Outstanding due is ${totalDue}.`
      );
    }

    const amountInPaise = Math.round(amount * 100);

    const order = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    const year = new Date().getFullYear();
    const sequence = await counterRepository.getNextSequence(`receipt-${year}`);
    const receiptNumber = generateReceiptNumber(sequence, year);

    const payment = await paymentRepository.create({
      student: new Types.ObjectId(studentId),
      amount,
      status: PaymentStatus.CREATED,
      channel: PaymentChannel.STUDENT_ONLINE,
      receiptNumber,
      razorpayOrderId: order.id,
      paymentDate: new Date(),
    });

    return {
      paymentId: payment._id.toString(),
      razorpayOrderId: order.id,
      amount: amountInPaise,
      currency: "INR",
      keyId: env.razorpayKeyId,
    };
  }

  /**
   * Verifies the signature Razorpay Checkout returns to the client after a
   * successful payment. Only on a valid signature does the fee ledger get
   * updated (via feeMonthService.applyPayment) — an invalid signature marks
   * the payment Failed and leaves every fee record untouched.
   */
  async verifyPayment(input: VerifyRazorpayPaymentInput): Promise<VerifyPaymentResult> {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = input;

    const payment = await paymentRepository.findByRazorpayOrderId(razorpayOrderId);
    if (!payment) {
      throw ApiError.notFound("Payment order not found");
    }

    // Already processed (e.g. webhook beat the client callback) — return as-is, don't double-apply.
    if (payment.status === PaymentStatus.SUCCESS) {
      const summary = await feeMonthService.getFeeSummary(payment.student.toString());
      return {
        payment,
        ledger: { monthsUpdated: [], totalApplied: payment.amount, remainingDue: summary.totalDue },
      };
    }

    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!isValid) {
      await paymentRepository.updateById(payment._id.toString(), {
        status: PaymentStatus.FAILED,
        razorpayPaymentId,
        razorpaySignature,
      });
      throw ApiError.badRequest("Payment verification failed");
    }

    let razorpayMethod: string | undefined;
    try {
      const razorpayPayment = await razorpayInstance.payments.fetch(razorpayPaymentId);
      razorpayMethod = razorpayPayment.method;
    } catch {
      razorpayMethod = undefined;
    }

    const updatedPayment = await paymentRepository.updateById(payment._id.toString(), {
      status: PaymentStatus.SUCCESS,
      razorpayPaymentId,
      razorpaySignature,
      paymentMode: mapRazorpayMethodToPaymentMode(razorpayMethod),
    });

    const ledger = await feeMonthService.applyPayment(payment.student.toString(), payment.amount);

    return { payment: updatedPayment as PaymentDocument, ledger };
  }

  /**
   * Called when the client reports a failed/cancelled checkout. No fee
   * record is changed — the student can call createOrder again at any time
   * to retry.
   */
  async markFailed(input: MarkPaymentFailedInput): Promise<PaymentDocument> {
    const payment = await paymentRepository.findByRazorpayOrderId(input.razorpayOrderId);
    if (!payment) {
      throw ApiError.notFound("Payment order not found");
    }

    if (payment.status === PaymentStatus.SUCCESS) {
      // Never downgrade a confirmed success because of a stale client-side failure report.
      return payment;
    }

    const updated = await paymentRepository.updateById(payment._id.toString(), {
      status: PaymentStatus.FAILED,
      remarks: input.reason,
    });

    return updated as PaymentDocument;
  }

  /**
   * Server-to-server confirmation from Razorpay. Idempotent: re-delivered
   * events for a payment already marked Success/Failed are no-ops.
   */
  async handleWebhookEvent(event: {
    event: string;
    payload: { payment: { entity: { id: string; order_id: string; method?: string } } };
  }): Promise<void> {
    const entity = event.payload?.payment?.entity;
    if (!entity?.order_id) return;

    const payment = await paymentRepository.findByRazorpayOrderId(entity.order_id);
    if (!payment) return; // unknown order — ignore

    if (event.event === "payment.captured") {
      if (payment.status === PaymentStatus.SUCCESS) return; // already applied, avoid double-crediting

      await paymentRepository.updateById(payment._id.toString(), {
        status: PaymentStatus.SUCCESS,
        razorpayPaymentId: entity.id,
        paymentMode: mapRazorpayMethodToPaymentMode(entity.method),
      });

      await feeMonthService.applyPayment(payment.student.toString(), payment.amount);
    } else if (event.event === "payment.failed") {
      if (payment.status === PaymentStatus.SUCCESS) return; // don't downgrade a confirmed success

      await paymentRepository.updateById(payment._id.toString(), {
        status: PaymentStatus.FAILED,
        razorpayPaymentId: entity.id,
      });
    }
  }
}

export const razorpayPaymentService = new RazorpayPaymentService();
