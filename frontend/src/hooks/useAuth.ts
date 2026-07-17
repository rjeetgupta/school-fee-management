import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { ApiSuccess } from "@/lib/api";
import type { LoginResult } from "@/types/auth";
import type { LoginFormValues } from "@/validations/auth.schema";
import { useAuthStore } from "@/store/useAuthStore";

export function useLogin() {
  const setAdminAuth = useAuthStore((s) => s.setAdminAuth);

  return useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const { data } = await apiClient.post<ApiSuccess<LoginResult>>("/auth/login", values);
      return data.data;
    },
    onSuccess: (result) => {
      setAdminAuth(result.token, result.admin);
    },
  });
}
