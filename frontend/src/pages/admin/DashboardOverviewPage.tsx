import { Users, Wallet, CalendarDays, AlertCircle } from "lucide-react";
import { useDashboardSummary } from "@/hooks/useDashboard";

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  tone: "navy" | "gold" | "danger";
}) {
  const toneClasses = {
    navy: "bg-navy/10 text-navy",
    gold: "bg-gold/15 text-gold-dark",
    danger: "bg-danger/10 text-danger",
  }[tone];

  return (
    <div className="site-card p-5">
      <div className={`inline-flex rounded-md p-2 ${toneClasses}`}>
        <Icon size={20} />
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-ink-soft">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-bold text-navy">
        {value}
      </p>
    </div>
  );
}

export function DashboardOverviewPage() {
  const { data, isLoading, isError } = useDashboardSummary();

  if (isError) {
    return (
      <div className="rounded-md bg-danger/10 px-4 py-6 text-sm text-danger">
        Couldn't load the dashboard summary.
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Students"
          value={isLoading ? "…" : String(data?.totalStudents ?? 0)}
          tone="navy"
        />
        <StatCard
          icon={Wallet}
          label="Today's Collection"
          value={isLoading ? "…" : `₹${(data?.todayCollection ?? 0).toLocaleString("en-IN")}`}
          tone="gold"
        />
        <StatCard
          icon={CalendarDays}
          label="This Month's Collection"
          value={isLoading ? "…" : `₹${(data?.monthCollection ?? 0).toLocaleString("en-IN")}`}
          tone="gold"
        />
        <StatCard
          icon={AlertCircle}
          label="Total Outstanding"
          value={isLoading ? "…" : `₹${(data?.totalOutstanding ?? 0).toLocaleString("en-IN")}`}
          tone="danger"
        />
      </div>

      <div className="site-card mt-6 p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
          Recent Payments
        </p>

        {isLoading && (
          <p className="mt-3 text-sm text-ink-soft">Loading…</p>
        )}

        {data && data.recentPayments.length === 0 && (
          <p className="mt-3 text-sm text-ink-soft">
            No payments recorded yet.
          </p>
        )}

        {data && data.recentPayments.length > 0 && (
          <ul className="mt-3 flex flex-col divide-y divide-paper-line">
            {data.recentPayments.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-navy">{p.studentName}</p>
                  <p className="text-xs text-ink-soft">
                    {p.admissionNumber} · Class {p.class}-{p.section} · {p.receiptNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{p.amount.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-ink-soft">
                    {new Date(p.paymentDate).toLocaleDateString("en-IN")} · {p.channel}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
