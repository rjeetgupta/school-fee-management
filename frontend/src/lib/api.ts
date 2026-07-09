import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api/v1",
  headers: { "Content-Type": "application/json" },
});

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
