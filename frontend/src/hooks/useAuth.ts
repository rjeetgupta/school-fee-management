import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { ApiSuccess } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import type { LoginFormValues } from "@/validations/auth.schema";
import type { LoginResult } from "@/types/auth";


export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const { data } = await apiClient.post<ApiSuccess<LoginResult>>("/auth/login", values);
      return data.data;
    },
    onSuccess: (result) => {
      setAuth(result.token, result.admin);
    },
  });
}
