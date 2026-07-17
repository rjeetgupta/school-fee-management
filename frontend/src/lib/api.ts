import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api/v1",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(error);
  }
);

/**
 * Shape returned by ApiResponse on the backend.
 */
export interface ApiSuccess<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
}

/**
 * Shape returned by errorHandler.middleware on the backend.
 */
export interface ApiFailure {
  success: false;
  statusCode: number;
  message: string;
  errors: Array<{ field?: string; message: string }>;
}

/** Extracts a human-readable message from any axios error hitting our API. */
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiFailure | undefined;
    if (data?.message) return data.message;
    if (error.message) return error.message;
  }
  return "Something went wrong. Please try again.";
}
