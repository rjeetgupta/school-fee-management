import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { ApiSuccess } from "@/lib/api";
import type { Student } from "@/types/student";
import type { FeeSummary, FeeMonth } from "@/types/feeMonth";
import type { Payment } from "@/types/payment";

export function useMyProfile() {
  return useQuery({
    queryKey: ["student-portal", "me"],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccess<Student>>("/student-portal/me");
      return data.data;
    },
  });
}

export function useMyFeeSummary() {
  return useQuery({
    queryKey: ["student-portal", "fee-summary"],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccess<FeeSummary>>("/student-portal/fee-summary");
      return data.data;
    },
  });
}

export function useMyFeeHistory() {
  return useQuery({
    queryKey: ["student-portal", "fee-history"],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccess<FeeMonth[]>>("/student-portal/fee-history");
      return data.data;
    },
  });
}

export function useMyPayments() {
  return useQuery({
    queryKey: ["student-portal", "payments"],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccess<Payment[]>>("/student-portal/payments");
      return data.data;
    },
  });
}
