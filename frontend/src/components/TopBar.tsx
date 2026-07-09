import { Plus, Banknote } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

export function TopBar() {
  const openCreateDrawer = useUIStore((s) => s.openCreateDrawer);
  const openDepositDialog = useUIStore((s) => s.openDepositDialog);

  return (
    <header className="border-b-2 border-[color:var(--color-ink)] pb-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--color-brass-dark)]">
            Module 1 · Student Register
          </p>
          <h1 className="font-display text-3xl font-semibold text-[color:var(--color-ink)]">
            Fee Register
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[color:var(--color-ink-soft)]">
            Administrator
          </span>
          <button
            type="button"
            onClick={openDepositDialog}
            className="flex items-center gap-1.5 rounded-sm border border-[color:var(--color-brass)] px-3.5 py-2 text-sm font-medium text-[color:var(--color-brass-dark)] hover:bg-[color:var(--color-brass)]/10"
          >
            <Banknote size={16} /> Deposit Fee
          </button>
          <button
            type="button"
            onClick={openCreateDrawer}
            className="flex items-center gap-1.5 rounded-sm bg-[color:var(--color-brass)] px-3.5 py-2 text-sm font-medium text-white hover:bg-[color:var(--color-brass-dark)]"
          >
            <Plus size={16} /> New Student
          </button>
        </div>
      </div>
    </header>
  );
}
