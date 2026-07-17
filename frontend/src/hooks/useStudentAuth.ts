import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { ApiSuccess } from "@/lib/api";
import type { StudentLoginResult } from "@/types/studentAuthResult";
import type { StudentLoginFormValues } from "@/validations/studentAuth.schema";
import { useAuthStore } from "@/store/useAuthStore";

export function useStudentLogin() {
  const setStudentAuth = useAuthStore((s) => s.setStudentAuth);

  return useMutation({
    mutationFn: async (values: StudentLoginFormValues) => {
      const { data } = await apiClient.post<ApiSuccess<StudentLoginResult>>(
        "/student-auth/login",
        values
      );
      return data.data;
    },
    onSuccess: (result) => {
      setStudentAuth(result.token, result.student);
    },
  });
}
