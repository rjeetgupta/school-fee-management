import Razorpay from "razorpay";
import crypto from "crypto";
import { env } from "@config/env";
import { PaymentMode } from "@app-types/payment.types";

export const razorpayInstance = new Razorpay({
  key_id: env.razorpayKeyId,
  key_secret: env.razorpayKeySecret,
});

/**
 * Verifies the signature returned by Razorpay Checkout after a successful
 * payment (client-side flow): HMAC-SHA256 of `orderId|paymentId` using the
 * key secret must match the signature the client received.
 */
export function verifyPaymentSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): boolean {
  const expected = crypto
    .createHmac("sha256", env.razorpayKeySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  return expected === razorpaySignature;
}

/**
 * Verifies a Razorpay webhook payload: HMAC-SHA256 of the raw request body
 * using the separate webhook secret must match the `x-razorpay-signature`
 * header. Must be run against the raw (unparsed) body — see app.ts, where
 * the webhook route is mounted with express.raw() ahead of express.json().
 */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const expected = crypto
    .createHmac("sha256", env.razorpayWebhookSecret)
    .update(rawBody)
    .digest("hex");

  return expected === signature;
}

/** Maps Razorpay's payment `method` field to our PaymentMode enum. */
export function mapRazorpayMethodToPaymentMode(method: string | undefined): PaymentMode {
  switch (method) {
    case "upi":
      return PaymentMode.UPI;
    case "card":
      return PaymentMode.CARD;
    case "netbanking":
      return PaymentMode.NET_BANKING;
    case "wallet":
      return PaymentMode.WALLET;
    default:
      return PaymentMode.OTHER;
  }
}
