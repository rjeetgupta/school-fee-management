import { Outlet, useNavigate, useLocation } from "react-router";
import { LogOut, Menu, Plus } from "lucide-react";
import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { StudentFormDrawer } from "@/components/StudentFormDrawer";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { FeeDepositDialog } from "@/components/FeeDepositDialog";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/students": "Student Management",
};

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = useAuthStore((s) => s.admin);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const openCreateDrawer = useUIStore((s) => s.openCreateDrawer);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const title = PAGE_TITLES[location.pathname] ?? "Admin Portal";

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-paper">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-paper-line bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-1 text-navy md:hidden"
              aria-label="Toggle navigation"
              onClick={() => setMobileNavOpen((v) => !v)}
            >
              <Menu size={20} />
            </button>
            <h1 className="font-display text-xl font-semibold text-navy">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {location.pathname === "/dashboard/students" && (
              <button
                type="button"
                onClick={openCreateDrawer}
                className="flex items-center gap-1.5 rounded-md bg-gold px-3.5 py-2 text-sm font-medium text-navy hover:bg-gold-dark"
              >
                <Plus size={16} /> New Student
              </button>
            )}
            <span className="hidden text-sm text-ink-soft sm:inline">
              {admin?.email ?? "Administrator"}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Logout"
              className="rounded-md p-2 text-ink-soft hover:bg-paper-line/40 hover:text-navy"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {mobileNavOpen && (
          <div className="border-b border-paper-line bg-white px-4 py-3 md:hidden">
            <nav className="flex flex-col gap-1">
              <a
                href="/dashboard"
                className="rounded-md px-3 py-2 text-sm font-medium text-ink-soft"
              >
                Overview
              </a>
              <a
                href="/dashboard/students"
                className="rounded-md px-3 py-2 text-sm font-medium text-ink-soft"
              >
                Students
              </a>
            </nav>
          </div>
        )}

        <main className="flex-1 overflow-y-auto px-6 py-8">
          <Outlet />
        </main>
      </div>

      <StudentFormDrawer />
      <DeleteConfirmDialog />
      <FeeDepositDialog />
    </div>
  );
}
