import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { ApiSuccess } from "@/lib/api";

export interface CreateOrderResult {
  paymentId: string;
  razorpayOrderId: string;
  amount: number; // paise
  currency: string;
  keyId: string;
}

export interface VerifyPaymentResult {
  payment: { _id: string; amount: number; receiptNumber: string };
  ledger: { remainingDue: number };
}

function invalidateStudentPortal(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["student-portal"] });
}

export function useCreateRazorpayOrder() {
  return useMutation({
    mutationFn: async (amount: number) => {
      const { data } = await apiClient.post<ApiSuccess<CreateOrderResult>>("/razorpay/order", {
        amount,
      });
      return data.data;
    },
  });
}

export function useVerifyRazorpayPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    }) => {
      const { data } = await apiClient.post<ApiSuccess<VerifyPaymentResult>>(
        "/razorpay/verify",
        payload
      );
      return data.data;
    },
    onSuccess: () => invalidateStudentPortal(queryClient),
  });
}

export function useMarkRazorpayFailed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { razorpayOrderId: string; reason?: string }) => {
      const { data } = await apiClient.post<ApiSuccess<unknown>>("/razorpay/failure", payload);
      return data.data;
    },
    onSuccess: () => invalidateStudentPortal(queryClient),
  });
}
