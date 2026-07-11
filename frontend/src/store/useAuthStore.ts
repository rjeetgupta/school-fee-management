import { create } from "zustand";
import type { Admin } from "@/types/auth";

const TOKEN_STORAGE_KEY = "school_fee_auth_token";
const ADMIN_STORAGE_KEY = "school_fee_auth_admin";

interface AuthState {
  token: string | null;
  admin: Admin | null;
  isAuthenticated: boolean;
  setAuth: (token: string, admin: Admin) => void;
  clearAuth: () => void;
}

function readStoredAdmin(): Admin | null {
  const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Admin;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem(TOKEN_STORAGE_KEY),
  admin: readStoredAdmin(),
  isAuthenticated: Boolean(localStorage.getItem(TOKEN_STORAGE_KEY)),

  setAuth: (token, admin) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin));
    set({ token, admin, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    set({ token: null, admin: null, isAuthenticated: false });
  },
}));
