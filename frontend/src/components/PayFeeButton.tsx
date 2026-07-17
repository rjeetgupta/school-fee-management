import { useState } from "react";
import { CreditCard } from "lucide-react";
import { loadRazorpayScript } from "@/lib/loadRazorpay";
import { useCreateRazorpayOrder, useVerifyRazorpayPayment, useMarkRazorpayFailed } from "@/hooks/useRazorpay";
import { useAuthStore } from "@/store/useAuthStore";
import { extractErrorMessage } from "@/lib/api";

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error?: { description?: string; metadata?: { order_id?: string } };
}

export function PayFeeButton({ amount, onSettled }: { amount: number; onSettled?: () => void }) {
  const student = useAuthStore((s) => s.student);
  const createOrder = useCreateRazorpayOrder();
  const verifyPayment = useVerifyRazorpayPayment();
  const markFailed = useMarkRazorpayFailed();

  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const isBusy = createOrder.isPending || isProcessing;

  const handlePay = async () => {
    setError(null);
    try {
      await loadRazorpayScript();
      const order = await createOrder.mutateAsync(amount);

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Greenwood Public School",
        description: "Fee Payment",
        order_id: order.razorpayOrderId,
        prefill: { name: student?.studentName ?? "" },
        theme: { color: "#16324F" },
        handler: async (response: unknown) => {
          const result = response as RazorpaySuccessResponse;
          setIsProcessing(true);
          try {
            await verifyPayment.mutateAsync({
              razorpayOrderId: result.razorpay_order_id,
              razorpayPaymentId: result.razorpay_payment_id,
              razorpaySignature: result.razorpay_signature,
            });
            onSettled?.();
          } catch (verifyError) {
            setError(extractErrorMessage(verifyError));
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: async () => {
            await markFailed.mutateAsync({
              razorpayOrderId: order.razorpayOrderId,
              reason: "Cancelled by student",
            });
            setError("Payment cancelled. You can retry anytime.");
            onSettled?.();
          },
        },
      });

      razorpay.on("payment.failed", async (response: unknown) => {
        const failure = response as RazorpayFailureResponse;
        await markFailed.mutateAsync({
          razorpayOrderId: failure.error?.metadata?.order_id ?? order.razorpayOrderId,
          reason: failure.error?.description,
        });
        setError("Payment failed. You can retry anytime.");
        onSettled?.();
      });

      razorpay.open();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handlePay}
        disabled={isBusy || amount <= 0}
        className="btn-primary disabled:opacity-50"
      >
        <CreditCard size={16} />
        {isBusy ? "Processing…" : `Pay ₹${amount.toLocaleString("en-IN")}`}
      </button>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}
