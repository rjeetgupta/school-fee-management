import { create } from "zustand";
import type { Admin } from "@/types/auth";
import type { StudentSession } from "@/types/studentAuth";

export type AuthRole = "admin" | "student";

const TOKEN_STORAGE_KEY = "school_fee_auth_token";
const ROLE_STORAGE_KEY = "school_fee_auth_role";
const PROFILE_STORAGE_KEY = "school_fee_auth_profile";

interface AuthState {
  token: string | null;
  role: AuthRole | null;
  admin: Admin | null;
  student: StudentSession | null;
  isAuthenticated: boolean;
  setAdminAuth: (token: string, admin: Admin) => void;
  setStudentAuth: (token: string, student: StudentSession) => void;
  clearAuth: () => void;
}

function readStoredProfile<T>(): T | null {
  const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

const storedRole = localStorage.getItem(ROLE_STORAGE_KEY) as AuthRole | null;
const storedProfile = readStoredProfile<Admin & StudentSession>();

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem(TOKEN_STORAGE_KEY),
  role: storedRole,
  admin: storedRole === "admin" ? (storedProfile as Admin) : null,
  student: storedRole === "student" ? (storedProfile as StudentSession) : null,
  isAuthenticated: Boolean(localStorage.getItem(TOKEN_STORAGE_KEY)),

  setAdminAuth: (token, admin) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(ROLE_STORAGE_KEY, "admin");
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(admin));
    set({ token, role: "admin", admin, student: null, isAuthenticated: true });
  },

  setStudentAuth: (token, student) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(ROLE_STORAGE_KEY, "student");
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(student));
    set({ token, role: "student", admin: null, student, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(ROLE_STORAGE_KEY);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    set({ token: null, role: null, admin: null, student: null, isAuthenticated: false });
  },
}));
