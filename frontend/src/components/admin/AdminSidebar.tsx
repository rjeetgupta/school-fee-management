import { NavLink } from "react-router";
import { LayoutDashboard, Users, Banknote, GraduationCap } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/students", label: "Students", icon: Users, end: false },
];

export function AdminSidebar() {
  const openDepositDialog = useUIStore((s) => s.openDepositDialog);

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-paper-line bg-white md:flex">
      <div className="flex items-center gap-2 border-b border-paper-line px-5 py-5">
        <GraduationCap size={22} className="text-navy" />
        <span className="font-display text-base font-semibold text-navy">
          Admin Portal
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors " +
              (isActive
                ? "bg-navy text-white"
                : "text-ink-soft hover:bg-paper-line/40")
            }
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}

        <button
          type="button"
          onClick={openDepositDialog}
          className="mt-2 flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-gold-dark hover:bg-gold/10"
        >
          <Banknote size={17} />
          Deposit Fee
        </button>
      </nav>
    </aside>
  );
}
