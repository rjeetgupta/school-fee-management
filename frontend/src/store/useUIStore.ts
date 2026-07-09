import { create } from "zustand";
import type { Student } from "@/types/student";

type DrawerMode = "closed" | "create" | "edit";

interface UIState {
  // Student form drawer
  drawerMode: DrawerMode;
  studentBeingEdited: Student | null;
  openCreateDrawer: () => void;
  openEditDrawer: (student: Student) => void;
  closeDrawer: () => void;

  // Delete confirmation dialog
  studentPendingDelete: Student | null;
  requestDelete: (student: Student) => void;
  cancelDelete: () => void;

  // Fee Deposit dialog: search step -> found student -> deposit/edit step
  isDepositDialogOpen: boolean;
  depositTargetStudent: Student | null;
  paymentBeingEdited: string | null; // payment id, set when using "Update Deposit"
  openDepositDialog: () => void;
  selectDepositStudent: (student: Student) => void;
  clearDepositStudent: () => void;
  startEditDeposit: (paymentId: string) => void;
  cancelEditDeposit: () => void;
  closeDepositDialog: () => void;

  // List filters (search / class / pagination) — kept in the store so
  // they survive drawer open/close and can be read by both the search bar
  // and the table without prop drilling.
  search: string;
  classFilter: string;
  page: number;
  limit: number;
  setSearch: (value: string) => void;
  setClassFilter: (value: string) => void;
  setPage: (value: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  drawerMode: "closed",
  studentBeingEdited: null,
  openCreateDrawer: () => set({ drawerMode: "create", studentBeingEdited: null }),
  openEditDrawer: (student) => set({ drawerMode: "edit", studentBeingEdited: student }),
  closeDrawer: () => set({ drawerMode: "closed", studentBeingEdited: null }),

  studentPendingDelete: null,
  requestDelete: (student) => set({ studentPendingDelete: student }),
  cancelDelete: () => set({ studentPendingDelete: null }),

  isDepositDialogOpen: false,
  depositTargetStudent: null,
  paymentBeingEdited: null,
  openDepositDialog: () =>
    set({ isDepositDialogOpen: true, depositTargetStudent: null, paymentBeingEdited: null }),
  selectDepositStudent: (student) => set({ depositTargetStudent: student }),
  clearDepositStudent: () => set({ depositTargetStudent: null, paymentBeingEdited: null }),
  startEditDeposit: (paymentId) => set({ paymentBeingEdited: paymentId }),
  cancelEditDeposit: () => set({ paymentBeingEdited: null }),
  closeDepositDialog: () =>
    set({ isDepositDialogOpen: false, depositTargetStudent: null, paymentBeingEdited: null }),

  search: "",
  classFilter: "",
  page: 1,
  limit: 10,
  setSearch: (value) => set({ search: value, page: 1 }),
  setClassFilter: (value) => set({ classFilter: value, page: 1 }),
  setPage: (value) => set({ page: value }),
}));
