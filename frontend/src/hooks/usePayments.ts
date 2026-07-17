import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { ApiSuccess } from "@/lib/api";
import type { DepositResult, Payment } from "@/types/payment";
import type { DepositFormValues } from "@/validations/payment.schema";

const STUDENTS_KEY = "students";
const PAYMENTS_KEY = "payments";
const FEE_MONTHS_KEY = "fee-months";

export function useDepositFee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ studentId, values }: { studentId: string; values: DepositFormValues }) => {
      const { data } = await apiClient.post<ApiSuccess<DepositResult>>("/payments", {
        studentId,
        ...values,
      });
      return data.data;
    },
    onSuccess: () => {
      // Refresh the ledger table and any open payment/fee-month views.
      queryClient.invalidateQueries({ queryKey: [STUDENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [PAYMENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [FEE_MONTHS_KEY] });
    },
  });
}

export function useUpdateDeposit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      paymentId,
      values,
    }: {
      paymentId: string;
      values: Partial<DepositFormValues>;
    }) => {
      const { data } = await apiClient.patch<ApiSuccess<DepositResult>>(
        `/payments/${paymentId}`,
        values
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STUDENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [PAYMENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [FEE_MONTHS_KEY] });
    },
  });
}

export function usePaymentsByStudent(studentId: string | null) {
  return useQuery({
    queryKey: [PAYMENTS_KEY, studentId],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccess<Payment[]>>(
        `/payments/student/${studentId}`
      );
      return data.data;
    },
    enabled: Boolean(studentId),
  });
}
