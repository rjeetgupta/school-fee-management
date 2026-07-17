import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { ApiSuccess } from "@/lib/api";
import type { FeeSummary } from "@/types/feeMonth";

export function useAdminFeeSummary(studentId: string | null) {
  return useQuery({
    queryKey: ["fee-months", "summary", studentId],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccess<FeeSummary>>(
        `/fee-months/student/${studentId}/summary`
      );
      return data.data;
    },
    enabled: Boolean(studentId),
  });
}
