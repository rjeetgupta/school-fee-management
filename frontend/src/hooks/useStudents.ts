import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { ApiSuccess } from "@/lib/api";
import type { PaginatedResult, Student, StudentListFilters } from "@/types/student";
import type { StudentFormValues } from "@/validations/student.schema";

const STUDENTS_KEY = "students";

function cleanPayload(values: StudentFormValues) {
  // Drop empty-string optional fields so they don't fail the backend's
  // regex validation (optional() in zod still runs the regex if a value is present).
  const payload: Record<string, unknown> = { ...values };
  if (!payload.whatsappNumber) delete payload.whatsappNumber;
  return payload;
}

export function useStudents(filters: StudentListFilters) {
  return useQuery({
    queryKey: [STUDENTS_KEY, filters],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccess<PaginatedResult<Student>>>("/students", {
        params: filters,
      });
      return data.data;
    },
    placeholderData: (previous) => previous,
  });
}

/**
 * On-demand student search used by the Fee Deposit dialog. Kept separate
 * from useStudents/the ledger table's filters so searching for a student to
 * deposit against never disturbs the main table's search/pagination state.
 */
export function useStudentSearch(query: string, enabled: boolean) {
  return useQuery({
    queryKey: [STUDENTS_KEY, "search", query],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccess<PaginatedResult<Student>>>("/students", {
        params: { search: query, limit: 5 },
      });
      return data.data;
    },
    enabled: enabled && query.trim().length > 0,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: StudentFormValues) => {
      const { data } = await apiClient.post<ApiSuccess<Student>>(
        "/students",
        cleanPayload(values)
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STUDENTS_KEY] });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: StudentFormValues }) => {
      const { data } = await apiClient.patch<ApiSuccess<Student>>(
        `/students/${id}`,
        cleanPayload(values)
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STUDENTS_KEY] });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete<ApiSuccess<Student>>(`/students/${id}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STUDENTS_KEY] });
    },
  });
}
